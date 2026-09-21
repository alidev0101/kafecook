import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان مقاله الزامی است"],
      trim: true,
      maxlength: [200, "عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "خلاصه نباید بیشتر از ۵۰۰ کاراکتر باشد"],
    },
    content: {
      type: String, // HTML content from TipTap
      required: [true, "محتوای مقاله الزامی است"],
    },
    featuredImage: {
      url: { type: String, default: null },
      alt: { type: String, default: "" },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    // زمان مطالعه (دقیقه) — محاسبه خودکار
    readTime: {
      type: Number,
      default: 1,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    // SEO
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160],
    },
    // Post type
    postType: {
      type: String,
      enum: ["article", "tutorial", "news", "product_review", "brewing_guide"],
      default: "article",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
postSchema.index({ slug: 1 });
postSchema.index({ status: 1 });
postSchema.index({ category: 1 });
postSchema.index({ author: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ isFeatured: 1 });
postSchema.index({ tags: 1 });
// Text search
postSchema.index(
  { title: "text", excerpt: "text", tags: "text" },
  { weights: { title: 10, tags: 5, excerpt: 2 } }
);

// Auto slug + readTime + publishedAt
postSchema.pre("save", function (next) {
  // Slug
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: false, locale: "fa" });
  }

  // Read time: ~200 words per minute for Persian
  if (this.isModified("content") && this.content) {
    const wordCount = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Auto-set publishedAt when status changes to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Virtual: excerpt auto-generate from content
postSchema.virtual("autoExcerpt").get(function () {
  if (this.excerpt) return this.excerpt;
  if (!this.content) return "";
  const text = this.content.replace(/<[^>]*>/g, "");
  return text.slice(0, 160) + (text.length > 160 ? "..." : "");
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
