export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Category from "@/models/Category";

// GET /api/categories
export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const parent = searchParams.get("parent");
  const featured = searchParams.get("featured");
  const tree = searchParams.get("tree");

  const filter = { isActive: true };

  if (parent === "null" || parent === "root") {
    filter.parent = null;
  } else if (parent) {
    filter.parent = parent;
  }

  if (featured === "true") filter.isFeatured = true;

  const categories = await Category.find(filter)
    .populate("parent", "name slug")
    .sort({ order: 1, name: 1 })
    .lean();

  // Build tree if requested
  if (tree === "true") {
    const roots = categories.filter((c) => !c.parent);
    const buildTree = (parentId) =>
      categories
        .filter((c) => c.parent?._id?.toString() === parentId?.toString())
        .map((c) => ({ ...c, children: buildTree(c._id) }));
    const treeData = roots.map((c) => ({
      ...c,
      children: buildTree(c._id),
    }));
    return successResponse(treeData);
  }

  return successResponse(categories);
});

// POST /api/categories  (admin only)
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    if (!body.name) {
      return errorResponse("نام دسته‌بندی الزامی است", 400);
    }

    const category = await Category.create(body);
    return successResponse(category, "دسته‌بندی با موفقیت ایجاد شد", 201);
  },
  { requireAdmin: true }
);
