"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Skeleton from "@/components/ui/Skeleton";
import { formatNumber } from "@/lib/utils";

export default function CategoryPage() {
  const { slug } = useParams();

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => axios.get(`/api/categories/${slug}`).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["category-products", category?._id],
    queryFn: () =>
      axios.get(`/api/products?category=${category._id}&limit=20`).then((r) => r.data),
    enabled: !!category?._id,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb
        items={[
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: catLoading ? "..." : category?.name || slug },
        ]}
      />

      <div className="mb-8">
        {catLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-gray-500 text-sm mt-2">{category.description}</p>
            )}
            {data?.pagination && (
              <p className="text-sm text-gray-400 mt-1">
                {formatNumber(data.pagination.total)} محصول
              </p>
            )}
          </>
        )}
      </div>

      <ProductGrid products={data?.data} loading={isLoading} />
    </div>
  );
}
