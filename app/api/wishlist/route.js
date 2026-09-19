import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Wishlist from "@/models/Wishlist";

// GET /api/wishlist
export const GET = apiHandler(
  async (req) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: "products.product",
        select: "name slug images basePrice baseComparePrice averageRating variants isActive",
      })
      .lean();

    if (!wishlist) return successResponse({ products: [], count: 0 });

    return successResponse({
      products: wishlist.products,
      count: wishlist.products.length,
    });
  },
  { requireAuth: true }
);

// POST /api/wishlist  (toggle)
export const POST = apiHandler(
  async (req) => {
    const { productId } = await req.json();
    if (!productId) return errorResponse("محصول الزامی است", 400);

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [{ product: productId }],
      });
      return successResponse({ added: true }, "به علاقه‌مندی‌ها اضافه شد");
    }

    const exists = wishlist.products.find(
      (p) => p.product.toString() === productId
    );

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (p) => p.product.toString() !== productId
      );
      await wishlist.save();
      return successResponse({ added: false }, "از علاقه‌مندی‌ها حذف شد");
    } else {
      wishlist.products.push({ product: productId });
      await wishlist.save();
      return successResponse({ added: true }, "به علاقه‌مندی‌ها اضافه شد");
    }
  },
  { requireAuth: true }
);
