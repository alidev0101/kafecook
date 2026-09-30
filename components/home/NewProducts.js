"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export default function NewProducts() {
  const reduce = useReducedMotion();
  const { data, isLoading } = useQuery({
    queryKey: ["new-products"],
    queryFn: () =>
      axios.get("/api/products?isNew=true&limit=4").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background">
      {/* soft color behind the glass so the blur has something to catch */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-[6%] h-[360px] w-[360px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px]" />
        <div className="absolute bottom-0 right-[8%] h-[340px] w-[340px] rounded-full bg-amber-300/25 dark:bg-amber-700/[0.12] blur-[110px]" />
      </div>

      <div className="container-custom relative">
        {/* Header */}
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
