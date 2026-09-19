"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export default function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () =>
      axios
        .get("/api/products?isBestSeller=true&limit=8")
        .then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <SectionHeader
          title="پرفروش‌ترین‌ها"
          subtitle="محبوب‌ترین قهوه‌های ما که مشتریان عاشقشان هستند"
          href="/products?isBestSeller=true"
        />
        <ProductGrid products={data} loading={isLoading} />
      </div>
    </section>
  );
}
