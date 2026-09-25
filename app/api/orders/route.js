export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Address from "@/models/Address";
import Coupon from "@/models/Coupon";
import Notification from "@/models/Notification";
import { checkoutSchema } from "@/validations/order";

// GET /api/orders  (user's orders)
export const GET = apiHandler(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(
      searchParams.get("page"),
      searchParams.get("limit") || 10
    );

    const filter = { user: req.user.id };
    const status = searchParams.get("status");
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .select("orderNumber status paymentMethod paymentStatus total items createdAt shippingAddress")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return paginatedResponse(orders, buildPaginationMeta(total, page, limit));
  },
  { requireAuth: true }
);

// POST /api/orders  (create order / checkout)
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400, errors);
    }

    const { addressId, shippingMethod, couponCode, notes, paymentMethod } =
      parsed.data;

    // ─── 1. بارگذاری آیتم‌های سفارش ───────────────────────────────────
    // اول از DB cart بخوان، اگر نبود از client items که در body ارسال شده
    let cartItemsRaw = [];

    const dbCart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (dbCart && dbCart.items.length > 0) {
      // Cart در DB موجود است — از آن استفاده کن
      cartItemsRaw = dbCart.items;
    } else if (body.clientItems && Array.isArray(body.clientItems) && body.clientItems.length > 0) {
      // Fallback: cart در DB نیست، اما client آیتم‌ها را ارسال کرده
      // این حالت زمانی رخ می‌دهد که sync ناموفق بوده یا کاربر تازه لاگین کرده
      cartItemsRaw = null; // flag: از clientItems استفاده شود
    } else {
      return errorResponse("سبد خرید خالی است. لطفاً دوباره محصول اضافه کنید", 400);
    }

    // ─── 2. Validate address ────────────────────────────────────────────
    const address = await Address.findOne({
      _id: addressId,
      user: req.user.id,
    }).lean();
    if (!address) return errorResponse("آدرس یافت نشد", 404);

    // ─── 3. Build order items ───────────────────────────────────────────
    const orderItems = [];

    if (cartItemsRaw) {
      for (const item of cartItemsRaw) {
        const product = item.product;

        if (!product || !product.isActive) {
          return errorResponse(`محصول "${item.productSnapshot?.name || "ناشناخته"}" موجود نیست`, 400);
        }

        let finalPrice;
        let comparePrice = null;
        let variantId = item.variantId || null;

        if (variantId) {
          const variant = product.variants.find(
            (v) => v._id.toString() === variantId.toString()
          );

          if (!variant || variant.stock < item.quantity) {
            return errorResponse(`موجودی کافی برای "${product.name}" وجود ندارد`, 400);
          }

          finalPrice = variant.price;
          comparePrice = variant.comparePrice || null;
        } else if (product.variants?.length > 0) {
          const variant = product.variants[0];

          if (variant.stock < item.quantity) {
            return errorResponse(`موجودی کافی برای "${product.name}" وجود ندارد`, 400);
          }

          finalPrice = variant.price;
          comparePrice = variant.comparePrice || null;
          variantId = variant._id;
        } else {
          if (product.stock < item.quantity) {
            return errorResponse(`موجودی کافی برای "${product.name}" وجود ندارد`, 400);
          }

          finalPrice = product.basePrice;
          comparePrice = product.comparePrice || null;
        }

        orderItems.push({
          product: product._id,
          variantId,
          quantity: item.quantity,
          price: finalPrice,
          comparePrice,
          productSnapshot: {
            name: product.name,
            image:
              product.images?.find((i) => i.isPrimary)?.url ||
              product.images?.[0]?.url ||
              null,
            slug: product.slug,
            weightLabel: item.productSnapshot?.weightLabel || null,
            grindLabel: item.productSnapshot?.grindLabel || null,
          },
        });
      }
    } else {
      for (const clientItem of body.clientItems) {
        if (!clientItem.productId || !clientItem.quantity) continue;

        const product = await Product.findById(clientItem.productId).lean();

        if (!product || !product.isActive) {
          return errorResponse(
            `محصول "${clientItem.productSnapshot?.name || "ناشناخته"}" موجود نیست`,
            400
          );
        }

        let finalPrice;
        let variantId = clientItem.variantId || null;

        if (variantId) {
          const variant = product.variants.find(
            (v) => v._id.toString() === variantId.toString()
          );

          if (!variant || variant.stock < clientItem.quantity) {
            return errorResponse(`موجودی کافی برای "${product.name}" وجود ندارد`, 400);
          }

          finalPrice = variant.price;
        } else if (product.variants?.length > 0) {
          const variant = product.variants[0];

          if (variant.stock < clientItem.quantity) {
            return errorResponse(`موجودی کافی برای "${product.name}" وجود ندارد`, 400);
          }

          finalPrice = variant.price;
          variantId = variant._id;
        } else {
          if (product.stock < clientItem.quantity) {
            return errorResponse(`موجودی کافی برای "${product.name}" وجود ندارد`, 400);
          }

          finalPrice = product.basePrice;
        }

        orderItems.push({
          product: product._id,
          variantId,
          quantity: parseInt(clientItem.quantity),
          price: finalPrice,
          comparePrice: null,
          productSnapshot: {
            name: product.name,
            image:
              product.images?.find((i) => i.isPrimary)?.url ||
              product.images?.[0]?.url ||
              null,
            slug: product.slug,
            weightLabel: clientItem.productSnapshot?.weightLabel || null,
            grindLabel: clientItem.productSnapshot?.grindLabel || null,
          },
        });
      }
    }

    if (orderItems.length === 0) {
      return errorResponse("هیچ محصولی برای ثبت سفارش وجود ندارد", 400);
    }

    // ─── 4. Pricing ─────────────────────────────────────────────────────
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const shippingCosts = { standard: 35000, express: 70000, pickup: 0 };
    const shippingCost = subtotal >= 500000 ? 0 : shippingCosts[shippingMethod] ?? 35000;

    // ─── 5. Coupon ──────────────────────────────────────────────────────
    let discountAmount = 0;
    let couponDoc = null;

    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (couponDoc && couponDoc.isValid) {
        const userUsage = couponDoc.usedBy.filter(
          (u) => u.user.toString() === req.user.id
        ).length;
        if (userUsage < couponDoc.maxUsagePerUser) {
          discountAmount = couponDoc.calculateDiscount(subtotal);
        }
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discountAmount);

    const shippingLabels = {
      standard: "ارسال معمولی",
      express: "ارسال اکسپرس",
      pickup: "دریافت حضوری",
    };

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // ─── 6. Create order ─────────────────────────────────────────────────
    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: orderItems,
      shippingAddress: {
        recipientName: address.recipientName,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district || "",
        street: address.street,
        alley: address.alley || "",
        buildingNumber: address.buildingNumber || "",
        unit: address.unit || "",
        postalCode: address.postalCode,
        notes: address.notes || "",
      },
      shippingMethod,
      shippingMethodLabel: shippingLabels[shippingMethod] || "ارسال معمولی",
      shippingCost,
      subtotal,
      discountAmount,
      coupon: couponDoc?._id || null,
      couponCode: couponDoc ? couponCode.toUpperCase() : null,
      total,
      paymentMethod: paymentMethod || "online",
      paymentStatus: paymentMethod === "online" ? "unpaid" : "pending",
      notes: notes || "",
      statusHistory: [{ status: "pending", note: "سفارش ثبت شد" }],
    });

    // از اینجا به بعد توی callback 
    if (paymentMethod === "cod") {
      // کاهش موجودی
      for (const item of orderItems) {
        if (item.variantId) {
          await Product.findOneAndUpdate(
            { _id: item.product, "variants._id": item.variantId },
            {
              $inc: {
                "variants.$.stock": -item.quantity,
                soldCount: item.quantity,
              },
            }
          );
        } else {
          await Product.findByIdAndUpdate(item.product, {
            $inc: {
              soldCount: item.quantity,
            },
          });
        }
      }

      // ثبت مصرف کوپن
      if (couponDoc) {
        couponDoc.usedCount += 1;
        couponDoc.usedBy.push({
          user: req.user.id,
          orderId: order._id,
        });
        await couponDoc.save();
      }

      // پاک کردن سبد
      await Cart.findOneAndDelete({
        user: req.user.id,
      });

      // اعلان
      await Notification.create({
        user: req.user.id,
        type: "order_new",
        title: "سفارش ثبت شد",
        message: `سفارش شما با شماره ${order.orderNumber} با موفقیت ثبت شد`,
        link: `/orders/${order._id}`,
        relatedModel: "Order",
        relatedId: order._id,
      });

      return successResponse(
        {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          total: order.total,
        },
        "سفارش شما با موفقیت ثبت شد",
        201
      );
    }

    return successResponse(
      {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
      },
      "سفارش ایجاد شد",
      201
    );

  },
  { requireAuth: true }
);
