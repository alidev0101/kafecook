"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Button from "@/components/ui/Button";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { formatNumber } from "@/lib/utils";

/* ─── Inner component that uses useSearchParams ──────────────────────────── */
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = {
    page: searchParams.get("page") || 1,
    limit: 12,
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    inStock: searchParams.get("inStock") || "",
    sort: searchParams.get("sort") || "newest",
    isFeatured: searchParams.get("isFeatured") || "",
    isNew: searchParams.get("isNew") || "",
    isBestSeller: searchParams.get("isBestSeller") || "",
  };

  const buildQS = (f) => {
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== "" && v != null) p.set(k, v); });
    return p.toString();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => axios.get(`/api/products?${buildQS(filters)}`).then((r) => r.data),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const handleFilterChange = useCallback(
    (changes) => {
      router.push(`/products?${buildQS({ ...filters, ...changes, page: 1 })}`, { scroll: false });
    },
    [filters, router]
  );

  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 1024) setFilterOpen(false); };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const activeFiltersCount = [
    filters.category, filters.brand, filters.minPrice,
    filters.maxPrice, filters.minRating, filters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="container-custom py-6 pt-20">
      

      <div className="glass rounded-2xl px-5 sm:px-7 py-5 mb-3 mt-2 flex items-center justify-between gap-4">
        {/* <div>
          <h1 className="font-morabba text-2xl font-black text-foreground">
            همه محصولات
          </h1>
          {data?.pagination && (
            <p className="text-sm text-muted-foreground mt-1">
              {formatNumber(data.pagination.total)} محصول برای شما پیدا شد
            </p>
          )}
        </div> */}

        <Breadcrumb items={[{ label: "محصولات" }]} />

        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden flex items-center gap-2 !bg-white/60 dark:!bg-white/[0.06] backdrop-blur-xl border-white/80 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-none"
          onClick={() => setFilterOpen(true)}
        >
          <SlidersHorizontal size={15} />
          فیلترها
          {activeFiltersCount > 0 && (
            <span className="bg-gradient-to-b from-coffee-400 to-coffee-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Grid */}
        <main className="flex-1 min-w-0">
          <ProductGrid
            products={data?.data}
            loading={isLoading}
            enableSlider={false}
            emptyMessage="هیچ محصولی با این فیلترها یافت نشد"
          />
          {data?.pagination && (
            <Pagination
              page={Number(data.pagination.page)}
              totalPages={data.pagination.totalPages}
              onPageChange={(p) =>
                router.push(`/products?${buildQS({ ...filters, page: p })}`, { scroll: true })
              }
            />
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] glass-strong z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between sticky top-0 z-10 pb-4">
                  <h2 className="font-bold text-foreground">فیلترها</h2>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-white/[0.06] text-muted-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  onFilterChange={(c) => { handleFilterChange(c); setFilterOpen(false); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page wrapper with Suspense ─────────────────────────────────────────── */
export default function ProductsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense
        fallback={
          <div className="container-custom py-8">
            <div className="h-8 bg-muted rounded-xl w-48 mb-6 animate-pulse" />
            <ProductGridSkeleton count={12} />
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}
