import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getCartFilter(req) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return { user: session.user.id };
  const sessionId = req.headers.get("x-session-id");
  if (sessionId) return { sessionId };
  return null;
}

// PUT /api/cart/:itemId  (update quantity)
export const PUT = apiHandler(async (req, { params }) => {
  const { quantity } = await req.json();
  if (!quantity || quantity < 1) return errorResponse("تعداد معتبر نیست", 400);

  const filter = await getCartFilter(req);
  if (!filter) return errorResponse("سبد خرید یافت نشد", 404);

  const cart = await Cart.findOne(filter);
  if (!cart) return errorResponse("سبد خرید یافت نشد", 404);

  const item = cart.items.id(params.itemId);
  if (!item) return errorResponse("آیتم یافت نشد", 404);

  item.quantity = quantity;
  await cart.save();

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - (cart.discountAmount || 0));
  const itemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return successResponse({ ...cart.toObject(), subtotal, total, itemsCount }, "تعداد بروزرسانی شد");
});

// DELETE /api/cart/:itemId  (remove item)
export const DELETE = apiHandler(async (req, { params }) => {
  const filter = await getCartFilter(req);
  if (!filter) return errorResponse("سبد خرید یافت نشد", 404);

  const cart = await Cart.findOne(filter);
  if (!cart) return errorResponse("سبد خرید یافت نشد", 404);

  cart.items = cart.items.filter((item) => item._id.toString() !== params.itemId);
  await cart.save();

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - (cart.discountAmount || 0));
  const itemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return successResponse({ ...cart.toObject(), subtotal, total, itemsCount }, "محصول از سبد حذف شد");
});
