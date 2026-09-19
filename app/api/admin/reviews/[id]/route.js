/**
 * PATCH  /api/admin/reviews/:id  — تغییر status یا ویرایش نظر
 * DELETE /api/admin/reviews/:id  — حذف نظر
 */
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Review from "@/models/Review";
import Product from "@/models/Product";

// PATCH: تغییر وضعیت یا ویرایش
export const PATCH = apiHandler(
  async (req, { params }) => {
    const { id } = params;
    const body = await req.json();

    const review = await Review.findById(id);
    if (!review) return errorResponse("نظر یافت نشد", 404);

    const allowedStatuses = ["pending", "approved", "rejected"];

    if (body.status) {
      if (!allowedStatuses.includes(body.status)) {
        return errorResponse("وضعیت نامعتبر است", 400);
      }
      review.status = body.status;
    }
    if (body.adminNote !== undefined) {
      review.adminNote = body.adminNote;
    }

    await review.save();

    // بعد از تغییر status، میانگین رتبه محصول update می‌شود (توسط post-save hook در Review model)

    return successResponse(review, "نظر بروزرسانی شد");
  },
  { requireAdmin: true }
);

// DELETE: حذف نظر
export const DELETE = apiHandler(
  async (req, { params }) => {
    const { id } = params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) return errorResponse("نظر یافت نشد", 404);

    // بروزرسانی رتبه محصول بعد از حذف
    const Product = (await import("@/models/Product")).default;
    const stats = await Review.aggregate([
      { $match: { product: review.product, status: "approved" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(review.product, {
      averageRating: stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0,
      reviewsCount: stats[0]?.count || 0,
    });

    return successResponse(null, "نظر حذف شد");
  },
  { requireAdmin: true }
);
