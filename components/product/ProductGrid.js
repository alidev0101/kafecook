"use client";

import ProductCard from "./ProductCard";
import UniversalSlider from "@/components/shared/UniversalSlider";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Coffee } from "lucide-react";

export default function ProductGrid({
  products,
  loading,
  emptyMessage,
  cols = 5,
  enableSlider = true,
}) {
  if (loading) return <ProductGridSkeleton count={5} />;

  if (!products?.length) {
    return (
      <EmptyState
        icon={Coffee}
        title="محصولی یافت نشد"
        description={emptyMessage || "هیچ محصولی با این مشخصات وجود ندارد"}
      />
    );
  }

  const mobileCols = Math.min(cols, 2);
  const tabletCols = Math.min(cols, 3);

  if (!enableSlider) {
    return (
      <div
        className={`grid grid-cols-${mobileCols} sm:grid-cols-${tabletCols} lg:grid-cols-${cols} gap-2 md:gap-3`}
      >
        {products.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <UniversalSlider
      items={products}
      slidesPerView={mobileCols}
      spaceBetween={16}
      breakpoints={{
        640: { slidesPerView: tabletCols, spaceBetween: 18 },
        1024: { slidesPerView: cols, spaceBetween: 20 },
      }}
      renderItem={(product) => <ProductCard product={product} />}
    />
  );
}