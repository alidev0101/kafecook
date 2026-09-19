import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Coffee } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ProductGrid({ products, loading, emptyMessage, cols = 4 }) {
  if (loading) return <ProductGridSkeleton count={cols === 4 ? 8 : 4} />;

  if (!products?.length) {
    return (
      <EmptyState
        icon={Coffee}
        title="محصولی یافت نشد"
        description={emptyMessage || "هیچ محصولی با این مشخصات وجود ندارد"}
      />
    );
  }

  const gridClass = {
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  }[cols] ?? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${gridClass} gap-4 md:gap-5`}
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
