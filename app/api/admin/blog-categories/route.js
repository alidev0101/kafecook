export const dynamic = "force-dynamic";

import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import BlogCategory from "@/models/BlogCategory";
import slugify from "slugify";

export const GET = apiHandler(
  async () => {
    const cats = await BlogCategory.find({}).sort({ order: 1, name: 1 }).lean();
    return successResponse(cats);
  },
  { requireAdmin: true }
);

export const POST = apiHandler(
  async (req) => {
    const body = await req.json();
    if (!body.name?.trim()) return errorResponse("نام دسته‌بندی الزامی است", 400);

    const slug =
      body.slug?.trim() ||
      slugify(body.name, { lower: true, strict: false, locale: "fa" });

    const exists = await BlogCategory.findOne({ slug });
    if (exists) return errorResponse("این slug قبلاً ثبت شده است", 409);

    const cat = await BlogCategory.create({ ...body, slug });
    return successResponse(cat, "دسته‌بندی ایجاد شد", 201);
  },
  { requireAdmin: true }
);
