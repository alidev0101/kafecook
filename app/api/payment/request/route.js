import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import Order from "@/models/Order";

export const POST = apiHandler(
  async (req) => {
    const body = await req.json();
    const { orderId } = body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "این سفارش قابل پرداخت نیست" },
        { status: 400 }
      );
    }

    // اینجا API درگاه را صدا می‌زنی
    // const payment = await ...

    // مثال:
    const authority = "...";

    await Order.findByIdAndUpdate(order._id, {
      paymentAuthority: authority,
      paymentStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl: `https://YOUR-GATEWAY-PAYMENT-URL/${authority}`,
      },
    });
  },
  { requireAuth: true }
);