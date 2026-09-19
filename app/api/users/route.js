export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import {
  successResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";
import User from "@/models/User";

// GET /api/users  (admin only)
export const GET = apiHandler(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(
      searchParams.get("page"),
      searchParams.get("limit") || 20
    );

    const filter = {};
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const role = searchParams.get("role");
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return paginatedResponse(users, buildPaginationMeta(total, page, limit));
  },
  { requireAdmin: true }
);
