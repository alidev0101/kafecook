import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Coupon from "@/models/Coupon";

export const PUT = apiHandler(
  async (req, { params }) => {
    const body = await req.json();
    const coupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!coupon) return errorResponse("کد تخفیف یافت نشد", 404);
    return successResponse(coupon, "کد تخفیف بروزرسانی شد");
  },
  { requireAdmin: true }
);

export const DELETE = apiHandler(
  async (req, { params }) => {
    const coupon = await Coupon.findByIdAndDelete(params.id);
    if (!coupon) return errorResponse("کد تخفیف یافت نشد", 404);
    return successResponse(null, "کد تخفیف حذف شد");
  },
  { requireAdmin: true }
);
