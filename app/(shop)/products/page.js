"use client";

import { useState, useCallback, useEffect } from "react";
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
import { formatNumber } from "@/lib/utils";

export default function ProductsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = {
    page:         searchParams.get("page")        || 1,
    limit:        12,
    search:       searchParams.get("search")      || "",
    category:     searchParams.get("category")    || "",
    brand:        searchParams.get("brand")       || "",
    minPrice:     searchParams.get("minPrice")    || "",
    maxPrice:     searchParams.get("maxPrice")    || "",
    minRating:    searchParams.get("minRating")   || "",
    inStock:      searchParams.get("inStock")     || "",
    sort:         searchParams.get("sort")        || "newest",
    isFeatured:   searchParams.get("isFeatured")  || "",
    isNew:        searchParams.get("isNew")       || "",
    isBestSeller: searchParams.get("isBestSeller")|| "",
  };

  const buildQS = (f) => {
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== "" && v != null) p.set(k, v); });
    return p.toString();
  };

  const { data, isLoading } = useQuery({
    queryKey:  ["products", filters],
    queryFn:   () => axios.get(`/api/products?${buildQS(filters)}`).then((r) => r.data),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const handleFilterChange = useCallback(
    (changes) => {
      router.push(`/products?${buildQS({ ...filters, ...changes, page: 1 })}`, { scroll: false });
    },
    [filters, router]
  );

  // close sidebar on resize to desktop
  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 1024) setFilterOpen(false); };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const activeFiltersCount = [filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.minRating, filters.inStock].filter(Boolean).length;

  return (
    <div className="bg-background min-h-screen">
      <div className="container-custom py-6">
        <Breadcrumb items={[{ label: "محصولات" }]} />

        {/* Page header */}
        <div className="flex items-center justify-between mb-6 mt-2">
          <div>
            <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>
              همه محصولات
            </h1>
            {data?.pagination && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {formatNumber(data.pagination.total)} محصول
              </p>
            )}
          </div>

          {/* Mobile filter button */}
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden flex items-center gap-2"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={15} />
            فیلترها
            {activeFiltersCount > 0 && (
              <span className="bg-coffee-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* ── Grid ── */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={data?.data}
              loading={isLoading}
              emptyMessage="هیچ محصولی با این فیلترها یافت نشد"
            />
            {data?.pagination && (
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={(p) =>
                  router.push(`/products?${buildQS({ ...filters, page: p })}`, { scroll: true })
                }
              />
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[90vw] bg-card border-r border-border z-50 overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-bold text-foreground">فیلترها</h2>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
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
