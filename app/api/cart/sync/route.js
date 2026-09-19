export const dynamic = 'force-dynamic';
/**
 * POST /api/cart/sync
 * Client cart را کاملاً با سرور sync می‌کند.
 * اگر کاربر لاگین باشد، cart در MongoDB ذخیره می‌شود
 * تا در checkout بتوان آن را خواند.
 */
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export const POST = apiHandler(
  async (req) => {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return errorResponse("آیتم‌های سبد الزامی است", 400);
    }

    // اگر سبد خالی ارسال شد، cart را در DB حذف کن
    if (items.length === 0) {
      await Cart.findOneAndDelete({ user: req.user.id });
      return successResponse(null, "سبد خرید خالی شد");
    }

    // Validate & normalize items
    const validItems = [];
    for (const item of items) {
      if (!item.productId || !item.price || !item.quantity) continue;

      // بررسی وجود محصول (اختیاری — برای performance می‌توان skip کرد)
      // const product = await Product.findById(item.productId).lean();
      // if (!product || !product.isActive) continue;

      validItems.push({
        product: item.productId,
        variantId: item.variantId || null,
        quantity: Math.max(1, parseInt(item.quantity) || 1),
        price: parseFloat(item.price) || 0,
        comparePrice: item.comparePrice ? parseFloat(item.comparePrice) : null,
        productSnapshot: {
          name: item.productSnapshot?.name || "",
          image: item.productSnapshot?.image || null,
          slug: item.productSnapshot?.slug || "",
          weightLabel: item.productSnapshot?.weightLabel || null,
          grindLabel: item.productSnapshot?.grindLabel || null,
        },
      });
    }

    // upsert: اگر cart وجود داشت update کن، وگرنه create
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        items: validItems,
        // TTL را refresh کن
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
        runValidators: false, // snapshot validation skip
      }
    );

    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const itemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);

    return successResponse(
      { cartId: cart._id, subtotal, itemsCount },
      "سبد خرید با موفقیت ذخیره شد"
    );
  },
  { requireAuth: true } // اگر لاگین نبود، 401 برمی‌گردد — cartStore آن را silent fail می‌کند
);
