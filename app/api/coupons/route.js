import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Coupon from "@/models/Coupon";
import { couponSchema } from "@/validations/order";

// GET /api/coupons  (admin only)
export const GET = apiHandler(
  async (req) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return successResponse(coupons);
  },
  { requireAdmin: true }
);

// POST /api/coupons  (admin only)
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400, errors);
    }

    const coupon = await Coupon.create(parsed.data);
    return successResponse(coupon, "کد تخفیف با موفقیت ایجاد شد", 201);
  },
  { requireAdmin: true }
);
