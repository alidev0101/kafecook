import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "امتیاز الزامی است"],
      min: [1, "امتیاز باید حداقل ۱ باشد"],
      max: [5, "امتیاز نباید بیشتر از ۵ باشد"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد"],
    },
    body: {
      type: String,
      required: [true, "متن نظر الزامی است"],
      trim: true,
      minlength: [10, "نظر باید حداقل ۱۰ کاراکتر باشد"],
      maxlength: [1000, "نظر نباید بیشتر از ۱۰۰۰ کاراکتر باشد"],
    },
    pros: [String], // نقاط مثبت
    cons: [String], // نقاط منفی
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    adminNote: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // one review per user per product
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Update product rating after review save/delete
reviewSchema.post("save", async function () {
  await updateProductRating(this.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await updateProductRating(doc.product);
});

async function updateProductRating(productId) {
  const Product = mongoose.model("Product");
  const stats = await mongoose
    .model("Review")
    .aggregate([
      { $match: { product: productId, status: "approved" } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewsCount: stats[0].reviewsCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewsCount: 0,
    });
  }
}

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
