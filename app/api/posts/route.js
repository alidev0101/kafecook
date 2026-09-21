export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";

/**
 * GET /api/posts
 * صفحه‌بندی، فیلتر دسته، جستجو، فیلتر وضعیت (فقط published برای عموم)
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(
      searchParams.get("page"),
      searchParams.get("limit") || 9
    );

    const filter = { status: "published" };

    const category = searchParams.get("category");
    if (category) filter.category = category;

    const tag = searchParams.get("tag");
    if (tag) filter.tags = tag;

    const postType = searchParams.get("postType");
    if (postType) filter.postType = postType;

    const featured = searchParams.get("featured");
    if (featured === "true") filter.isFeatured = true;

    const search = searchParams.get("search");
    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const sortMap = {
      newest: { publishedAt: -1 },
      oldest: { publishedAt: 1 },
      popular: { viewCount: -1 },
    };
    const sort = sortMap[searchParams.get("sort")] || sortMap.newest;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name avatar")
        .populate("category", "name slug color")
        .select(
          "title slug excerpt featuredImage author category tags publishedAt readTime viewCount isFeatured postType"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    return paginatedResponse(posts, buildPaginationMeta(total, page, limit));
  } catch (err) {
    console.error(err);
    return errorResponse("خطای سرور", 500);
  }
}
