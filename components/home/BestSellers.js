"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeader from "../shared/SectionHeader";

/* shared glass surface — same as FeaturedCategories / ProductCard */
const glass =
  "bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl " +
  "border border-white/80 dark:border-white/[0.08] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_12px_32px_-16px_rgba(90,50,20,0.22)] " +
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.65)]";

export default function BestSellers() {
  const reduce = useReducedMotion();

  const { data, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () =>
      axios.get("/api/products?isBestSeller=true&limit=8").then((r) => r.data.data),
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
          title="پرفروش‌ترین‌ها"
          subtitle="محبوب‌ترین قهوه‌هایی که مشتریان عاشقشان هستند"
          href="/products?isBestSeller=true"
        />

        <ProductGrid products={data} loading={isLoading} />
      </div>
    </section>
  );
}