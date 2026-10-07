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
      className={"mt-14"}
        items={[
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: catLoading ? "..." : category?.name || slug },
        ]}
      />

      {/* <div className="glass rounded-3xl px-6 py-6 mb-8">
        {catLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <>
            <h1 className="font-morabba text-2xl md:text-3xl font-black text-foreground">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground text-sm mt-2 max-w-2xl leading-relaxed">{category.description}</p>
            )}
            {data?.pagination && (
              <p className="text-sm text-muted-foreground mt-2">
                {formatNumber(data.pagination.total)} محصول
              </p>
            )}
          </>
        )}
      </div> */}

      <ProductGrid products={data?.data} loading={isLoading} />
    </div>
  );
}
