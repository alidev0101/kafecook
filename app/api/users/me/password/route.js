export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import User from "@/models/User";
import { changePasswordSchema } from "@/validations/auth";

// PUT /api/users/me/password
export const PUT = apiHandler(
  async (req) => {
    const body = await req.json();

    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400, errors);
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return errorResponse("کاربر یافت نشد", 404);

    const isValid = await user.comparePassword(parsed.data.currentPassword);
    if (!isValid) return errorResponse("رمز عبور فعلی اشتباه است", 400);

    user.password = parsed.data.newPassword;
    await user.save();

    return successResponse(null, "رمز عبور با موفقیت تغییر کرد");
  },
  { requireAuth: true }
);
