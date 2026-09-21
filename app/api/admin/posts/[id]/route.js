export const dynamic = "force-dynamic";

import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Post from "@/models/Post";

// GET /api/admin/posts/:id
export const GET = apiHandler(
  async (req, { params }) => {
    const post = await Post.findById(params.id)
      .populate("author", "name avatar")
      .populate("category", "name slug color")
      .populate("relatedPosts", "title slug featuredImage");
    if (!post) return errorResponse("مقاله یافت نشد", 404);
    return successResponse(post);
  },
  { requireAdmin: true }
);

// PUT /api/admin/posts/:id — ویرایش مقاله
export const PUT = apiHandler(
  async (req, { params }) => {
    const body = await req.json();

    const post = await Post.findById(params.id);
    if (!post) return errorResponse("مقاله یافت نشد", 404);

    const allowed = [
      "title", "slug", "excerpt", "content", "category", "tags",
      "status", "featuredImage", "postType", "isFeatured",
      "metaTitle", "metaDescription", "relatedPosts",
    ];

    allowed.forEach((key) => {
      if (body[key] !== undefined) post[key] = body[key];
    });

    // اگر slug تغییر کرده، یکتا بودن بررسی شود
    if (body.slug && body.slug !== post.slug) {
      const dup = await Post.findOne({ slug: body.slug, _id: { $ne: params.id } });
      if (dup) return errorResponse("این slug قبلاً استفاده شده است", 409);
    }

    await post.save();
    return successResponse(post, "مقاله بروزرسانی شد");
  },
  { requireAdmin: true }
);

// DELETE /api/admin/posts/:id
export const DELETE = apiHandler(
  async (req, { params }) => {
    const post = await Post.findByIdAndDelete(params.id);
    if (!post) return errorResponse("مقاله یافت نشد", 404);
    return successResponse(null, "مقاله حذف شد");
  },
  { requireAdmin: true }
);

// PATCH /api/admin/posts/:id — toggle status
export const PATCH = apiHandler(
  async (req, { params }) => {
    const { status } = await req.json();
    if (!["draft", "published"].includes(status)) {
      return errorResponse("وضعیت نامعتبر است", 400);
    }
    const post = await Post.findByIdAndUpdate(
      params.id,
      {
        status,
        ...(status === "published" ? { publishedAt: new Date() } : {}),
      },
      { new: true }
    ).select("_id title status publishedAt");
    if (!post) return errorResponse("مقاله یافت نشد", 404);
    return successResponse(
      post,
      status === "published" ? "مقاله منتشر شد" : "مقاله به پیش‌نویس تبدیل شد"
    );
  },
  { requireAdmin: true }
);
