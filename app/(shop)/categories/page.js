import { Suspense } from "react";
import CategoriesClient from "./CategoriesClient";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

export const metadata = {
  title: "دسته‌بندی‌های محصولات | کافه کوک",
  description: "مرور همه دسته‌بندی‌های قهوه — اسپرسو، دان قهوه، فیلتر، کولد برو و محصولات ویژه کافه کوک",
  keywords: ["دسته‌بندی قهوه", "انواع قهوه", "اسپرسو", "فیلتر", "کولد برو"],
};

async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .populate("parent", "name slug")
      .sort({ order: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  // جدا کردن دسته‌های اصلی و زیردسته
  const roots = categories.filter((c) => !c.parent);
  const children = categories.filter((c) => c.parent);

  const tree = roots.map((root) => ({
    ...root,
    children: children.filter(
      (c) => c.parent?._id?.toString() === root._id?.toString()
        || c.parent?.toString() === root._id?.toString()
    ),
  }));

  return (
    <div className="bg-background min-h-screen">
      {/* SEO Hero */}
      <section className="bg-coffee-gradient py-14 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-coffee-300 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-600 blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <nav aria-label="breadcrumb" className="flex items-center justify-center gap-2 text-coffee-300 text-sm mb-5">
            <a href="/" className="hover:text-white transition-colors">خانه</a>
            <span>/</span>
            <span className="text-white">دسته‌بندی‌ها</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>
            همه دسته‌بندی‌ها
          </h1>
          <p className="text-coffee-200 text-base max-w-xl mx-auto">
            از بین {categories.length} دسته‌بندی متنوع قهوه، سبک مورد علاقه‌ات را پیدا کن
          </p>
        </div>
      </section>

      <div className="container-custom py-12">
        <Suspense fallback={<CategoriesGridSkeleton />}>
          <CategoriesClient tree={tree} allCategories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
          <div className="aspect-[4/3] bg-muted" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
