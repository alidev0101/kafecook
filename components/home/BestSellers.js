"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export default function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () =>
      axios.get("/api/products?isBestSeller=true&limit=8").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="پرفروش‌ترین‌ها"
            subtitle="محبوب‌ترین قهوه‌هایی که مشتریان عاشقشان هستند"
            href="/products?isBestSeller=true"
          />
        </motion.div>
        <ProductGrid products={data} loading={isLoading} />
      </div>
    </section>
  );
}
