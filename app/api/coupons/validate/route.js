import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Coupon from "@/models/Coupon";

// POST /api/coupons/validate
export const POST = apiHandler(
  async (req) => {
    const { code, orderAmount } = await req.json();

    if (!code) return errorResponse("کد تخفیف الزامی است", 400);

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return errorResponse("کد تخفیف معتبر نیست", 404);
    if (!coupon.isValid) return errorResponse("کد تخفیف منقضی شده یا غیرفعال است", 400);

    if (orderAmount && orderAmount < coupon.minOrderAmount) {
      return errorResponse(
        `حداقل مبلغ سفارش برای این کد تخفیف ${coupon.minOrderAmount.toLocaleString("fa")} تومان است`,
        400
      );
    }

    // Check user usage
    const userUsage = coupon.usedBy.filter(
      (u) => u.user.toString() === req.user.id
    ).length;
    if (userUsage >= coupon.maxUsagePerUser) {
      return errorResponse("شما قبلاً از این کد تخفیف استفاده کرده‌اید", 400);
    }

    const discountAmount = coupon.calculateDiscount(orderAmount || 0);

    return successResponse(
      {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
        description: coupon.description,
      },
      "کد تخفیف معتبر است"
    );
  },
  { requireAuth: true }
);
