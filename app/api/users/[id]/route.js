import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import User from "@/models/User";

export const PUT = apiHandler(
  async (req, { params }) => {
    const { id } = await params;
    const body = await req.json();

    const user = await User.findById(id).select("+password");

    if (!user) return errorResponse("کاربر یافت نشد", 404);

    if (body.email && body.email !== user.email) {
      const exists = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: id },
      });

      if (exists) return errorResponse("این ایمیل قبلاً ثبت شده است", 400);
    }

    user.name = body.name?.trim() || user.name;
    user.email = body.email?.toLowerCase().trim() || user.email;
    user.phone = body.phone?.trim() || undefined;
    user.role = body.role || user.role;

    if (typeof body.isActive === "boolean") {
      user.isActive = body.isActive;
    }

    if (body.password?.trim()) {
      user.password = body.password.trim();
    }

    await user.save();

    const result = user.toObject();
    delete result.password;

    return successResponse(result, "اطلاعات کاربر بروزرسانی شد");
  },
  { requireAdmin: true }
);