import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import User from "@/models/User";
import { changePasswordSchema } from "@/validations/auth";

// GET /api/users/me
export const GET = apiHandler(
  async (req) => {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return errorResponse("کاربر یافت نشد", 404);
    return successResponse(user);
  },
  { requireAuth: true }
);

// PUT /api/users/me
export const PUT = apiHandler(
  async (req) => {
    const body = await req.json();
    const allowedFields = ["name", "phone", "avatar"];
    const updates = {};
    allowedFields.forEach((f) => {
      if (body[f] !== undefined) updates[f] = body[f];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return successResponse(user, "پروفایل بروزرسانی شد");
  },
  { requireAuth: true }
);
