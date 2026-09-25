import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import User from "@/models/User";

export const PATCH = apiHandler(
  async (req, { params }) => {
    const { id } = await params;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return errorResponse("وضعیت نامعتبر است", 400);
    }

    if (req.user.id === id && !isActive) {
      return errorResponse("نمی‌توانید حساب خودتان را غیرفعال کنید", 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return errorResponse("کاربر یافت نشد", 404);

    return successResponse(
      user,
      isActive ? "کاربر فعال شد" : "کاربر غیرفعال شد"
    );
  },
  { requireAdmin: true }
);