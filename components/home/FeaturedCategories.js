"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

const defaultCats = [
  { _id: "1", name: "اسپرسو",     slug: "espresso",      icon: "☕" },
  { _id: "2", name: "دان قهوه",   slug: "coffee-beans",  icon: "🫘" },
  { _id: "3", name: "فیلتری",     slug: "filter-coffee", icon: "🫖" },
  { _id: "4", name: "کولد برو",   slug: "cold-brew",     icon: "🧊" },
  { _id: "5", name: "قهوه ویژه",  slug: "specialty",     icon: "⭐" },
  { _id: "6", name: "هدیه قهوه",  slug: "gift-sets",     icon: "🎁" },
];

export default function FeaturedCategories() {
  const { data: cats, isLoading } = useQuery({
    queryKey: ["featured-categories"],
    queryFn: () =>
      axios.get("/api/categories?featured=true&parent=root").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const items = cats?.length ? cats : defaultCats;

  return (
    <section className="py-16 md:py-20 bg-muted/30 dark:bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="section-title"
            >
              دسته‌بندی‌های محبوب
            </motion.h2>
            <p className="section-subtitle">سبک مورد علاقه‌ات را پیدا کن</p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-coffee-600 dark:text-coffee-400 hover:underline"
          >
            همه دسته‌ها <ArrowLeft size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))
            : items.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-card hover:shadow-card transition-all duration-300"
                  >
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-coffee-100 dark:bg-coffee-900/40 group-hover:bg-coffee-gradient transition-all duration-300 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:shadow-warm">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      ) : (
                        <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                          {cat.icon || "☕"}
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors text-center leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
