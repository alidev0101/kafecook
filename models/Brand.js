import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام برند الزامی است"],
      trim: true,
      unique: true,
      maxlength: [60, "نام برند نباید بیشتر از ۶۰ کاراکتر باشد"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد"],
    },
    logo: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    origin: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
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
  }
);

// Indexes
brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });
brandSchema.index({ isFeatured: 1 });

// Auto generate slug
brandSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: false,
      locale: "fa",
    });
  }
  next();
});

// Virtual: products count
brandSchema.virtual("productsCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
  count: true,
});

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
export default Brand;
