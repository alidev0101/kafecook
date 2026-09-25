export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Brand from "@/models/Brand";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");

   const filter = req.user?.role === "ADMIN" ? {} : { isActive: true };
  if (featured === "true") filter.isFeatured = true;

  const brands = await Brand.find(filter)
    .sort({ order: 1, name: 1 })
    .lean();

  return successResponse(brands);
},{ optionalAuth: true });

export const POST = apiHandler(
  async (req) => {
    const body = await req.json();
    if (!body.name) return errorResponse("نام برند الزامی است", 400);
    const brand = await Brand.create(body);
    return successResponse(brand, "برند با موفقیت ایجاد شد", 201);
  },
  { requireAdmin: true }
);
