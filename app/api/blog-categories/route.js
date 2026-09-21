export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import BlogCategory from "@/models/BlogCategory";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await connectDB();
    const cats = await BlogCategory.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return successResponse(cats);
  } catch (err) {
    return errorResponse("خطای سرور", 500);
  }
}
