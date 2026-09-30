import { Suspense } from "react";
import CategoriesClient from "./CategoriesClient";
import PageHero from "@/components/shared/PageHero";
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
      <PageHero
        title="همه دسته‌بندی‌ها"
        subtitle={`از بین ${categories.length} دسته‌بندی متنوع قهوه، سبک مورد علاقه‌ات را پیدا کن`}
        breadcrumb={[{ label: "دسته‌بندی‌ها" }]}
      />

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
        <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
          <div className="aspect-[4/3] m-2 mb-0 rounded-2xl bg-muted/60" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
