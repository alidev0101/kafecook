export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { successResponse, errorResponse } from "@/lib/apiResponse";

/**
 * GET /api/posts/:slug — یک مقاله منتشرشده
 */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const post = await Post.findOne({ slug, status: "published" })
      .populate("author", "name avatar")
      .populate("category", "name slug color")
      .populate({
        path: "relatedPosts",
        select: "title slug excerpt featuredImage publishedAt readTime category",
        populate: { path: "category", select: "name slug color" },
        match: { status: "published" },
      })
      .lean();

    if (!post) return errorResponse("مقاله یافت نشد", 404);

    // Increment view count (fire and forget)
    Post.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } }).exec();

    return successResponse(post);
  } catch (err) {
    console.error(err);
    return errorResponse("خطای سرور", 500);
  }
}
