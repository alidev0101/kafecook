"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatNumber } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

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

  const buildQueryString = (f) => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) params.set(k, v);
    });
    return params.toString();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () =>
      axios.get(`/api/products?${buildQueryString(filters)}`).then((r) => r.data),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const handleFilterChange = useCallback(
    (changes) => {
      const newFilters = { ...filters, ...changes, page: 1 };
      router.push(`/products?${buildQueryString(newFilters)}`, { scroll: false });
    },
    [filters, router]
  );

  const handlePageChange = (page) => {
    router.push(`/products?${buildQueryString({ ...filters, page })}`, { scroll: true });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container-custom py-6">
        <Breadcrumb items={[{ label: "محصولات" }]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">همه محصولات</h1>
            {data?.pagination && (
              <p className="text-sm text-gray-500 mt-1">
                {formatNumber(data.pagination.total)} محصول
              </p>
            )}
          </div>

          {/* Mobile filter button */}
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden flex items-center gap-2"
            onClick={() => setFilterModalOpen(true)}
          >
            <SlidersHorizontal size={16} />
            فیلترها
          </Button>
        </div>

        <div className="flex gap-7">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* Products */}
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
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="فیلترها"
        size="sm"
      >
        <ProductFilters
          filters={filters}
          onFilterChange={(changes) => {
            handleFilterChange(changes);
            setFilterModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
