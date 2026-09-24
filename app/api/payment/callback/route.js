import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import Order from "@/models/Order";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (status !== "OK") {
    return Response.redirect(
      new URL("/payment-result?status=failed", req.url)
    );
  }

  const order = await Order.findOne({
    paymentAuthority: authority,
  });

  if (!order) {
    return Response.redirect(
      new URL("/payment-result?status=failed", req.url)
    );
  }

  // Verify با API درگاه
  // const result = await verifyPayment(...)

  // اگر پرداخت تأیید شد:
  await Order.findByIdAndUpdate(order._id, {
    paymentStatus: "paid",
    paymentStatusLabel: "پرداخت شده",
    status: "processing",
    paidAt: new Date(),
    // trackingCode: result.refId
  });

  return Response.redirect(
    new URL(
      `/payment-result?orderId=${order._id}&orderNumber=${order.orderNumber}&status=success`,
      req.url
    )
  );
}