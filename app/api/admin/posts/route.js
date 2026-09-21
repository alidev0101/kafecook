export const dynamic = "force-dynamic";

import { apiHandler } from "@/lib/apiHandler";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";
import Post from "@/models/Post";
import slugify from "slugify";

// GET /api/admin/posts — همه مقالات (هر وضعیتی)
export const GET = apiHandler(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(
      searchParams.get("page"),
      searchParams.get("limit") || 15
    );

    const filter = {};
    const status = searchParams.get("status");
    if (status && ["draft", "published"].includes(status)) filter.status = status;

    const category = searchParams.get("category");
    if (category) filter.category = category;

    const search = searchParams.get("search");
    if (search?.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name")
        .populate("category", "name slug")
        .select("title slug status publishedAt readTime viewCount isFeatured postType category author createdAt featuredImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const [draftCount, publishedCount] = await Promise.all([
      Post.countDocuments({ status: "draft" }),
      Post.countDocuments({ status: "published" }),
    ]);

    return paginatedResponse(posts, {
      ...buildPaginationMeta(total, page, limit),
      counts: { draft: draftCount, published: publishedCount, all: draftCount + publishedCount },
    });
  },
  { requireAdmin: true }
);

// POST /api/admin/posts — ایجاد مقاله جدید
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    const { title, content, excerpt, category, tags, status, featuredImage,
      postType, isFeatured, metaTitle, metaDescription, relatedPosts } = body;

    if (!title?.trim()) return errorResponse("عنوان مقاله الزامی است", 400);
    if (!content?.trim()) return errorResponse("محتوای مقاله الزامی است", 400);

    // slug auto-generate
    let slug = body.slug?.trim() ||
      slugify(title, { lower: true, strict: false, locale: "fa" }) +
        "-" + Date.now().toString(36);

    // اطمینان از یکتا بودن slug
    const existing = await Post.findOne({ slug });
    if (existing) slug = slug + "-" + Date.now().toString(36);

    const post = await Post.create({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || "",
      content,
      category: category || null,
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      status: status || "draft",
      featuredImage: featuredImage || { url: null, alt: "" },
      postType: postType || "article",
      isFeatured: isFeatured || false,
      metaTitle: metaTitle?.trim() || "",
      metaDescription: metaDescription?.trim() || "",
      relatedPosts: Array.isArray(relatedPosts) ? relatedPosts : [],
      author: req.user.id,
    });

    return successResponse(post, "مقاله با موفقیت ایجاد شد", 201);
  },
  { requireAdmin: true }
);
