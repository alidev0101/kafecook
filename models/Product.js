import mongoose from "mongoose";
import slugify from "slugify";

// Variant sub-schema (weight + grind type)
const variantSchema = new mongoose.Schema({
  weight: {
    type: Number, // grams
    required: true,
  },
  weightLabel: {
    type: String, // e.g. "۲۵۰ گرم"
    required: true,
  },
  grindType: {
    type: String,
    enum: ["whole_bean", "fine", "medium", "coarse", "espresso"],
    default: "whole_bean",
  },
  grindLabel: {
    type: String, // e.g. "دان کامل"
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  comparePrice: {
    type: Number,
    default: null,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  sku: {
    type: String,
    trim: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام محصول الزامی است"],
      trim: true,
      maxlength: [120, "نام محصول نباید بیشتر از ۱۲۰ کاراکتر باشد"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "توضیح کوتاه نباید بیشتر از ۳۰۰ کاراکتر باشد"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "دسته‌بندی الزامی است"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    variants: [variantSchema],
    // Base price (from cheapest variant or direct)
    basePrice: {
      type: Number,
      min: 0,
    },
    baseComparePrice: {
      type: Number,
      default: null,
    },
    // Coffee-specific attributes
    coffeeAttributes: {
      origin: { type: String, trim: true }, // کشور مبدأ
      roastLevel: {
        type: String,
        enum: ["light", "medium_light", "medium", "medium_dark", "dark"],
      },
      roastLevelLabel: String,
      aroma: { type: String, trim: true }, // عطر و بو
      acidity: {
        type: Number,
        min: 1,
        max: 5,
      }, // 1-5
      body: {
        type: Number,
        min: 1,
        max: 5,
      }, // 1-5
      bitterness: {
        type: Number,
        min: 1,
        max: 5,
      },
      sweetness: {
        type: Number,
        min: 1,
        max: 5,
      },
      brewingMethods: [String], // ['espresso', 'french_press', ...]
      flavorNotes: [String], // ['شکلات', 'کارامل', ...]
      process: String, // washed, natural, honey
      variety: String, // arabica, robusta, blend
      altitude: String, // ارتفاع کشت
    },
    brewingGuide: {
      type: String,
      trim: true,
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    suppressReservedKeysWarning: true,
  }
);

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ deletedAt: 1 });
// Text search index
productSchema.index(
  { name: "text", description: "text", tags: "text" },
  { weights: { name: 10, tags: 5, description: 1 } }
);

// Auto generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: false,
      locale: "fa",
    });
  }
  // Set basePrice from variants
  if (this.variants && this.variants.length > 0) {
    const prices = this.variants.map((v) => v.price);
    this.basePrice = Math.min(...prices);
    const comparePrices = this.variants
      .map((v) => v.comparePrice)
      .filter(Boolean);
    if (comparePrices.length > 0) {
      this.baseComparePrice = Math.min(...comparePrices);
    }
  }
  next();
});

// Virtual: discount percentage
productSchema.virtual("discountPercent").get(function () {
  if (!this.baseComparePrice || !this.basePrice) return 0;
  return Math.round(
    ((this.baseComparePrice - this.basePrice) / this.baseComparePrice) * 100
  );
});

// Virtual: primary image
productSchema.virtual("primaryImage").get(function () {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find((img) => img.isPrimary) || this.images[0];
});

// Soft delete filter
productSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ deletedAt: null });
  }
  next();
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
