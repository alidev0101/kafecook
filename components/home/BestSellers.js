"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeader from "../shared/SectionHeader";


export default function BestSellers() {

  const { data, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () =>
      axios.get("/api/products?isBestSeller=true&limit=20").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="relative overflow-x-hidden py-16 md:py-24">
      {/* soft color behind the glass so the blur has something to catch */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* <div className="absolute top-10 left-[6%] h-[360px] w-[360px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px] z-10" /> */}
        {/* <div className="absolute bottom-0 right-[8%] h-[340px] w-[340px] rounded-full bg-amber-300/25 dark:bg-amber-700/[0.12] blur-[110px] z-10" /> */}
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