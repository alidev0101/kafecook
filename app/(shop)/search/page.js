"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatNumber } from "@/lib/utils";

export default function SearchPage() {
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

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-coffee-100 flex items-center justify-center">
          <Search size={20} className="text-coffee-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            نتایج جستجو برای "{q}"
          </h1>
          {data?.pagination && (
            <p className="text-sm text-gray-500 mt-0.5">
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
        <div className="text-center py-20 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>عبارتی برای جستجو وارد کنید</p>
        </div>
      )}
    </div>
  );
}
