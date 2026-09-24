export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";

async function getCartFilter(req) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return { user: session.user.id };
  }
  const sessionId = req.headers.get("x-session-id");
  if (sessionId) return { sessionId };
  return null;
}

// GET /api/cart
export const GET = apiHandler(async (req) => {
  const filter = await getCartFilter(req);
  if (!filter) return successResponse({ items: [], subtotal: 0, total: 0, itemsCount: 0 });

  const cart = await Cart.findOne(filter)
    .populate({
      path: "items.product",
      select: "name slug images variants isActive",
    })
    .populate("coupon", "code type value")
    .lean();

  if (!cart) return successResponse({ items: [], subtotal: 0, total: 0, itemsCount: 0 });

  // Calculate totals
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - (cart.discountAmount || 0));
  const itemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return successResponse({ ...cart, subtotal, total, itemsCount });
});

// POST /api/cart  (add item)
export const POST = apiHandler(async (req) => {
  await connectDB();
  const body = await req.json();
  const { productId, variantId, quantity = 1 } = body;

  if (!productId) return errorResponse("محصول الزامی است", 400);

  // Find product
  const product = await Product.findById(productId).lean();
  if (!product || !product.isActive) return errorResponse("محصول یافت نشد", 404);

  // Find variant
  let price, comparePrice, variantSnapshot = {};
  if (variantId) {
    const variant = product.variants.find((v) => v._id.toString() === variantId);
    if (!variant) return errorResponse("ویریانت یافت نشد", 404);
    if (variant.stock < quantity) return errorResponse("موجودی کافی نیست", 400);
    price = variant.price;
    comparePrice = variant.comparePrice;
    variantSnapshot = {
      weightLabel: variant.weightLabel,
      grindLabel: variant.grindLabel,
    };
  } else {
    const firstVariant = product.variants[0];
    if (firstVariant) {
      price = firstVariant.price;
      comparePrice = firstVariant.comparePrice;
    } else {
      price = product.basePrice;
    }
  }

  const filter = await getCartFilter(req);
  let cart;

  if (filter) {
    cart = await Cart.findOne(filter);
  }

  if (!cart) {
    const session = await getServerSession(authOptions);
    const sessionId = req.headers.get("x-session-id");
    cart = new Cart({
      user: session?.user?.id || null,
      sessionId: session?.user?.id ? null : sessionId,
      items: [],
    });
  }

  // Check if item already exists
  const existingIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      (variantId ? item.variantId?.toString() === variantId : !item.variantId)
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      variantId: variantId || null,
      quantity,
      price,
      comparePrice,
      productSnapshot: {
        name: product.name,
        image: product.images?.[0]?.url,
        slug: product.slug,
        ...variantSnapshot,
      },
    });
  }

  await cart.save();

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return successResponse({ ...cart.toObject(), subtotal, itemsCount }, "محصول به سبد اضافه شد");
});

// DELETE /api/cart  (clear cart)
export const DELETE = apiHandler(async (req) => {
  const filter = await getCartFilter(req);
  if (filter) await Cart.findOneAndDelete(filter);
  return successResponse(null, "سبد خرید خالی شد");
});
