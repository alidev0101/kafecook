"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Skeleton from "@/components/ui/Skeleton";

export default function BrandPage() {
  const { slug } = useParams();

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => axios.get(`/api/brands/${slug}`).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["brand-products", brand?._id],
    queryFn: () =>
      axios.get(`/api/products?brand=${brand._id}&limit=20`).then((r) => r.data),
    enabled: !!brand?._id,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb
        items={[
          { label: "برندها", href: "/brands" },
          { label: brandLoading ? "..." : brand?.name || slug },
        ]}
      />

      {/* Brand header */}
      <div className="flex items-center gap-5 mb-8 p-6 bg-white rounded-2xl shadow-card">
        <div className="w-16 h-16 rounded-xl bg-cream-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
          {brand?.logo ? (
            <Image src={brand.logo} alt={brand.name} fill className="object-contain p-2" />
          ) : (
            <span className="text-3xl">☕</span>
          )}
        </div>
        <div>
          {brandLoading ? (
            <Skeleton className="h-7 w-36 mb-2" />
          ) : (
            <h1 className="text-2xl font-black text-gray-900">{brand?.name}</h1>
          )}
          {brand?.description && (
            <p className="text-sm text-gray-500 mt-1 max-w-lg">{brand.description}</p>
          )}
        </div>
      </div>

      <ProductGrid products={data?.data} loading={isLoading} />
    </div>
  );
}
