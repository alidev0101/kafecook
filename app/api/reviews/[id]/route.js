import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Review from "@/models/Review";

// PATCH /api/reviews/:id  (admin: update status)
export const PATCH = apiHandler(
  async (req, { params }) => {
    const { status } = await req.json();
    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) return errorResponse("وضعیت نامعتبر است", 400);

    const review = await Review.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    if (!review) return errorResponse("نظر یافت نشد", 404);

    return successResponse(review, "وضعیت نظر بروزرسانی شد");
  },
  { requireAdmin: true }
);
