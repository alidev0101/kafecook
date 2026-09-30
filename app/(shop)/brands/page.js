import { Suspense } from "react";
import BrandsClient from "./BrandsClient";
import PageHero from "@/components/shared/PageHero";
import connectDB from "@/lib/mongodb";
import Brand from "@/models/Brand";

export const metadata = {
  title: "برندهای قهوه | کافه کوک",
  description:
    "معرفی و مرور همه برندهای قهوه موجود در کافه کوک؛ برندهای معتبر قهوه ایرانی و خارجی را بررسی و انتخاب کنید.",
  keywords: [
    "برند قهوه",
    "برندهای قهوه",
    "خرید قهوه",
    "قهوه ایرانی",
    "قهوه خارجی",
  ],
};

async function getBrands() {
  try {
    await connectDB();

    const brands = await Brand.find({ isActive: true, deletedAt: null })
      .populate("productsCount")
      .sort({ order: 1, name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(brands));
  } catch {
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="همه برندها"
        subtitle={`از بین ${brands.length} برند قهوه، برند مورد علاقه‌ات را پیدا کن`}
        breadcrumb={[{ label: "برندها" }]}
      />

      <div className="container-custom py-12">
        <Suspense fallback={<BrandsGridSkeleton />}>
          <BrandsClient brands={brands} />
        </Suspense>
      </div>
    </div>
  );
}

function BrandsGridSkeleton() {
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
