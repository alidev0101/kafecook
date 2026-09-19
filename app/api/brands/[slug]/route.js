import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Brand from "@/models/Brand";

export const GET = apiHandler(async (req, { params }) => {
  const brand = await Brand.findOne({ slug: params.slug, isActive: true }).lean();
  if (!brand) return errorResponse("برند یافت نشد", 404);
  return successResponse(brand);
});

export const PUT = apiHandler(
  async (req, { params }) => {
    const body = await req.json();
    const brand = await Brand.findOneAndUpdate({ slug: params.slug }, body, {
      new: true,
      runValidators: true,
    });
    if (!brand) return errorResponse("برند یافت نشد", 404);
    return successResponse(brand, "برند بروزرسانی شد");
  },
  { requireAdmin: true }
);

export const DELETE = apiHandler(
  async (req, { params }) => {
    const brand = await Brand.findOneAndUpdate(
      { slug: params.slug },
      { deletedAt: new Date(), isActive: false },
      { new: true }
    );
    if (!brand) return errorResponse("برند یافت نشد", 404);
    return successResponse(null, "برند حذف شد");
  },
  { requireAdmin: true }
);
