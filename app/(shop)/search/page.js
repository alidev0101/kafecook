"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatNumber } from "@/lib/utils";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () =>
      axios.get(`/api/products?search=${encodeURIComponent(q)}&limit=20`).then((r) => r.data),
    enabled: q.trim().length >= 1,
    staleTime: 60 * 1000,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "جستجو" }]} />

      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="w-10 h-10 rounded-xl bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center">
          <Search size={20} className="text-coffee-600 dark:text-coffee-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            نتایج جستجو برای "{q}"
          </h1>
          {data?.pagination && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {formatNumber(data.pagination.total)} محصول یافت شد
            </p>
          )}
        </div>
      </div>

      {q.trim() ? (
        <ProductGrid
          products={data?.data}
          loading={isLoading}
          emptyMessage={`هیچ محصولی برای "${q}" یافت نشد`}
        />
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>عبارتی برای جستجو وارد کنید</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense
        fallback={
          <div className="container-custom py-8">
            <div className="h-8 bg-muted rounded-xl w-64 mb-6 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
