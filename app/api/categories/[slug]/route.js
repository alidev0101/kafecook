import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Category from "@/models/Category";

export const GET = apiHandler(async (req, { params }) => {
  const category = await Category.findOne({
    slug: params.slug,
    isActive: true,
  })
    .populate("parent", "name slug")
    .lean();

  if (!category) return errorResponse("دسته‌بندی یافت نشد", 404);
  return successResponse(category);
});

export const PUT = apiHandler(
  async (req, { params }) => {
    const body = await req.json();
    const category = await Category.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    );
    if (!category) return errorResponse("دسته‌بندی یافت نشد", 404);
    return successResponse(category, "دسته‌بندی بروزرسانی شد");
  },
  { requireAdmin: true }
);

export const DELETE = apiHandler(
  async (req, { params }) => {
    const category = await Category.findOneAndUpdate(
      { slug: params.slug },
      { deletedAt: new Date(), isActive: false },
      { new: true }
    );
    if (!category) return errorResponse("دسته‌بندی یافت نشد", 404);
    return successResponse(null, "دسته‌بندی حذف شد");
  },
  { requireAdmin: true }
);
