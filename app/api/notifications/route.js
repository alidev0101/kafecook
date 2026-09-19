import { apiHandler } from "@/lib/apiHandler";
import { successResponse } from "@/lib/apiResponse";
import Notification from "@/models/Notification";

// GET /api/notifications
export const GET = apiHandler(
  async (req) => {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    return successResponse({ notifications, unreadCount });
  },
  { requireAuth: true }
);

// PUT /api/notifications  (mark all read)
export const PUT = apiHandler(
  async (req) => {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return successResponse(null, "همه اعلان‌ها خوانده شد");
  },
  { requireAuth: true }
);
