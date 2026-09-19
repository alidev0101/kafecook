"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export default function NewProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["new-products"],
    queryFn: () =>
      axios.get("/api/products?isNew=true&limit=4").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="container-custom">
        <SectionHeader
          title="تازه‌واردها"
          subtitle="جدیدترین قهوه‌هایی که به کلکسیون ما اضافه شده‌اند"
          href="/products?isNew=true"
        />
        <ProductGrid products={data} loading={isLoading} />
      </div>
    </section>
  );
}
