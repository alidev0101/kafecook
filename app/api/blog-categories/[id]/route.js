export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import BlogCategory from "@/models/BlogCategory";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    // supports both id and slug
    const query = params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: params.id }
      : { slug: params.id };
    const cat = await BlogCategory.findOne(query).lean();
    if (!cat) return errorResponse("دسته‌بندی یافت نشد", 404);
    return successResponse(cat);
  } catch (err) {
    return errorResponse("خطای سرور", 500);
  }
}
