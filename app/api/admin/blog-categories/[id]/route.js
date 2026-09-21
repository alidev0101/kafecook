export const dynamic = "force-dynamic";

import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import BlogCategory from "@/models/BlogCategory";

export const PUT = apiHandler(
  async (req, { params }) => {
    const body = await req.json();
    const cat = await BlogCategory.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!cat) return errorResponse("دسته‌بندی یافت نشد", 404);
    return successResponse(cat, "دسته‌بندی بروزرسانی شد");
  },
  { requireAdmin: true }
);

export const DELETE = apiHandler(
  async (req, { params }) => {
    const cat = await BlogCategory.findByIdAndDelete(params.id);
    if (!cat) return errorResponse("دسته‌بندی یافت نشد", 404);
    return successResponse(null, "دسته‌بندی حذف شد");
  },
  { requireAdmin: true }
);
