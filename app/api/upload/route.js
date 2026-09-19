/**
 * POST /api/upload  — آپلود تصویر محصول
 * DELETE /api/upload — حذف تصویر
 *
 * فایل را در /public/uploads/products/ ذخیره می‌کند.
 * از sharp برای بهینه‌سازی و تغییر اندازه استفاده می‌شود.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { errorResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// اطمینان از وجود پوشه
async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

// POST: آپلود تصویر
export async function POST(req) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "احراز هویت لازم است" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "فایلی انتخاب نشده" }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "فقط فایل‌های JPG، PNG و WebP مجاز است" },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "حجم فایل نباید بیشتر از ۵ مگابایت باشد" },
        { status: 400 }
      );
    }

    await ensureDir(UPLOAD_DIR);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.type === "image/webp" ? "webp" : "jpg";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const filename = `product-${timestamp}-${random}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // بهینه‌سازی با sharp (در صورت در دسترس بودن)
    try {
      const sharp = (await import("sharp")).default;
      await sharp(buffer)
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(filepath.replace(/\.\w+$/, ".jpg"));

      const finalFilename = filename.replace(/\.\w+$/, ".jpg");
      const url = `/uploads/products/${finalFilename}`;

      return NextResponse.json({
        success: true,
        message: "تصویر با موفقیت آپلود شد",
        data: { url, filename: finalFilename },
      });
    } catch (sharpError) {
      // اگر sharp در دسترس نبود، فایل را مستقیم ذخیره کن
      await writeFile(filepath, buffer);
      const url = `/uploads/products/${filename}`;

      return NextResponse.json({
        success: true,
        message: "تصویر با موفقیت آپلود شد",
        data: { url, filename },
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "خطا در آپلود تصویر" }, { status: 500 });
  }
}

// DELETE: حذف تصویر
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { filename } = await req.json();
    if (!filename) {
      return NextResponse.json({ success: false, message: "نام فایل الزامی است" }, { status: 400 });
    }

    // Security: فقط اجازه حذف از پوشه uploads/products
    const safeName = path.basename(filename); // جلوگیری از path traversal
    if (!safeName.startsWith("product-")) {
      return NextResponse.json({ success: false, message: "عملیات غیرمجاز" }, { status: 403 });
    }

    const filepath = path.join(UPLOAD_DIR, safeName);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    return NextResponse.json({ success: true, message: "تصویر حذف شد" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, message: "خطا در حذف تصویر" }, { status: 500 });
  }
}
