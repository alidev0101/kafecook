import mongoose from "mongoose";
import slugify from "slugify";

const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام دسته‌بندی الزامی است"],
      trim: true,
      maxlength: [60, "نام نباید بیشتر از ۶۰ کاراکتر باشد"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300],
    },
    color: {
      type: String,
      default: "#be7040",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogCategorySchema.index({ slug: 1 });
blogCategorySchema.index({ isActive: 1 });

blogCategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: false, locale: "fa" });
  }
  next();
});

// virtual: posts count
blogCategorySchema.virtual("postsCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "category",
  count: true,
});

const BlogCategory =
  mongoose.models.BlogCategory ||
  mongoose.model("BlogCategory", blogCategorySchema);

export default BlogCategory;
