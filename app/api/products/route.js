import { apiHandler } from "@/lib/apiHandler";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";
import Product from "@/models/Product";
import { productSchema } from "@/validations/product";

// GET /api/products
export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const { page, limit, skip } = getPagination(
    searchParams.get("page"),
    searchParams.get("limit") || 12
  );

  // Build filter
  const filter = { isActive: true };

  const search = searchParams.get("search");
  if (search) {
    filter.$text = { $search: search };
  }

  const category = searchParams.get("category");
  if (category) filter.category = category;

  const brand = searchParams.get("brand");
  if (brand) filter.brand = brand;

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }

  const minRating = searchParams.get("minRating");
  if (minRating) filter.averageRating = { $gte: Number(minRating) };

  const inStock = searchParams.get("inStock");
  if (inStock === "true") {
    filter["variants.stock"] = { $gt: 0 };
  }

  const isFeatured = searchParams.get("isFeatured");
  if (isFeatured === "true") filter.isFeatured = true;

  const isNew = searchParams.get("isNew");
  if (isNew === "true") filter.isNew = true;

  const isBestSeller = searchParams.get("isBestSeller");
  if (isBestSeller === "true") filter.isBestSeller = true;

  // Sort
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { basePrice: 1 },
    "price-desc": { basePrice: -1 },
    popular: { soldCount: -1 },
    rating: { averageRating: -1 },
    featured: { isFeatured: -1, createdAt: -1 },
  };
  const sortParam = searchParams.get("sort") || "newest";
  const sort = sortMap[sortParam] || sortMap.newest;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .select(
        "name slug images basePrice baseComparePrice averageRating reviewsCount isFeatured isNew isBestSeller variants category brand soldCount"
      )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return paginatedResponse(products, buildPaginationMeta(total, page, limit));
});

// POST /api/products  (admin only)
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400, errors);
    }

    const product = await Product.create(parsed.data);

    return successResponse(product, "محصول با موفقیت ایجاد شد", 201);
  },
  { requireAdmin: true }
);
