import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Order from "@/models/Order";
import Notification from "@/models/Notification";

// GET /api/orders/:id
export const GET = apiHandler(
  async (req, { params }) => {
    const order = await Order.findOne({
      _id: params.id,
      user: req.user.id,
    })
      .populate("coupon", "code type value")
      .lean();

    if (!order) return errorResponse("سفارش یافت نشد", 404);
    return successResponse(order);
  },
  { requireAuth: true }
);

// PUT /api/orders/:id  (admin: update status)
export const PUT = apiHandler(
  async (req, { params }) => {
    const { status, adminNotes, trackingCode } = await req.json();

    const order = await Order.findById(params.id);
    if (!order) return errorResponse("سفارش یافت نشد", 404);

    const allowedStatuses = [
      "pending", "processing", "shipped", "delivered", "cancelled", "refunded",
    ];
    if (status && !allowedStatuses.includes(status)) {
      return errorResponse("وضعیت نامعتبر است", 400);
    }

    if (status) {
      order.status = status;
      order.statusHistory.push({
        status,
        note: adminNotes || "",
        changedBy: req.user.id,
      });
    }
    if (adminNotes) order.adminNotes = adminNotes;
    if (trackingCode) order.trackingCode = trackingCode;

    await order.save();

    // Notify user
    const statusMessages = {
      processing: { title: "سفارش در حال پردازش", type: "order_processing" },
      shipped: { title: "سفارش ارسال شد", type: "order_shipped" },
      delivered: { title: "سفارش تحویل داده شد", type: "order_delivered" },
      cancelled: { title: "سفارش لغو شد", type: "order_cancelled" },
    };
    if (status && statusMessages[status]) {
      await Notification.create({
        user: order.user,
        type: statusMessages[status].type,
        title: statusMessages[status].title,
        message: `وضعیت سفارش ${order.orderNumber} به ${order.statusLabel} تغییر کرد`,
        link: `/orders/${order._id}`,
        relatedModel: "Order",
        relatedId: order._id,
      });
    }

    return successResponse(order, "سفارش بروزرسانی شد");
  },
  { requireAdmin: true }
);
