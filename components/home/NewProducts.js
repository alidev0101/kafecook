"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export default function NewProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["new-products"],
    queryFn: () => axios.get("/api/products?isNew=true&limit=4").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="relative bg-background py-16 md:py-24 overflow-x-hidden md:overflow-x-visible">
      <div className="container-custom relative">
        <SectionHeader title="تازه‌واردها" subtitle="جدیدترین قهوه‌هایی که به کلکسیون ما اضافه شده‌اند" href="/products?isNew=true" />

        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute -top-10 right-[8%] h-[300px] w-[300px] rounded-full bg-coffee-400/20 blur-[100px] dark:bg-coffee-600/[0.14]" />
            <div className="absolute -bottom-10 left-[8%] h-[280px] w-[280px] rounded-full bg-amber-300/20 blur-[100px] dark:bg-amber-700/[0.12]" />
          </div>

          <div className="relative z-10">
            <ProductGrid products={data} loading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
}