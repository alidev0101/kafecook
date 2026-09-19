export const dynamic = 'force-dynamic';
/**
 * GET  /api/admin/reviews  — لیست نظرات برای ادمین با فیلتر status
 * PATCH /api/admin/reviews  — bulk status update (اختیاری)
 */
import { apiHandler } from "@/lib/apiHandler";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";
import Review from "@/models/Review";

export const GET = apiHandler(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(
      searchParams.get("page"),
      searchParams.get("limit") || 15
    );

    const filter = {};

    const status = searchParams.get("status");
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { body: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "name email avatar")
        .populate("product", "name slug images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    // آمار کلی
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Review.countDocuments({ status: "pending" }),
      Review.countDocuments({ status: "approved" }),
      Review.countDocuments({ status: "rejected" }),
    ]);

    return paginatedResponse(
      reviews,
      {
        ...buildPaginationMeta(total, page, limit),
        stats: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
      }
    );
  },
  { requireAdmin: true }
);
