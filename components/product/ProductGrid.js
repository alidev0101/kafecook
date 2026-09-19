import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Coffee } from "lucide-react";

export default function ProductGrid({ products, loading, emptyMessage }) {
  if (loading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Coffee}
        title="محصولی یافت نشد"
        description={emptyMessage || "هیچ محصولی با این مشخصات وجود ندارد"}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
