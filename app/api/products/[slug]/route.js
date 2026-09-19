import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Product from "@/models/Product";

// GET /api/products/:slug
export const GET = apiHandler(async (req, { params }) => {
  const { slug } = params;

  const product = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .populate("brand", "name slug logo")
    .lean();

  if (!product) {
    return errorResponse("محصول یافت نشد", 404);
  }

  // Increment view count
  Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();

  return successResponse(product);
});

// PUT /api/products/:slug  (admin only)
export const PUT = apiHandler(
  async (req, { params }) => {
    const { slug } = params;
    const body = await req.json();

    const product = await Product.findOne({ slug }).setOptions({
      includeDeleted: true,
    });

    if (!product) {
      return errorResponse("محصول یافت نشد", 404);
    }

    Object.assign(product, body);
    await product.save();

    return successResponse(product, "محصول با موفقیت بروزرسانی شد");
  },
  { requireAdmin: true }
);

// DELETE /api/products/:slug  (admin only - soft delete)
export const DELETE = apiHandler(
  async (req, { params }) => {
    const { slug } = params;

    const product = await Product.findOne({ slug });
    if (!product) {
      return errorResponse("محصول یافت نشد", 404);
    }

    // Soft delete
    product.deletedAt = new Date();
    product.isActive = false;
    await product.save();

    return successResponse(null, "محصول با موفقیت حذف شد");
  },
  { requireAdmin: true }
);
