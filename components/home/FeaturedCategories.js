"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUpLeft,
  Coffee,
  Bean,
  Droplets,
  Snowflake,
  Sparkles,
  Gift,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeader from "../shared/SectionHeader";

/* fallback categories (icons come from the slug map below, not from data) */
const defaultCats = [
  { _id: "1", name: "اسپرسو", slug: "espresso" },
  { _id: "2", name: "دان قهوه", slug: "coffee-beans" },
  { _id: "3", name: "فیلتری", slug: "filter-coffee" },
  { _id: "4", name: "کولد برو", slug: "cold-brew" },
  { _id: "5", name: "قهوه ویژه", slug: "specialty" },
  { _id: "6", name: "هدیه قهوه", slug: "gift-sets" },
  { _id: "7", name: "کافه کوک", slug: "gift-moka" },
];

/* slug → lucide icon. Unknown slugs fall back to Coffee */
const iconBySlug = {
  "espresso": Coffee,
  "coffee-beans": Bean,
  "filter-coffee": Droplets,
  "cold-brew": Snowflake,
  "specialty": Sparkles,
  "gift-sets": Gift,
};

/* shared glass surface — readable in both light and dark themes */
const glass =
  "bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl " +
  "border border-white/80 dark:border-white/[0.08] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_12px_32px_-16px_rgba(90,50,20,0.22)] " +
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.65)]";

/* cursor-follow spotlight: writes --x / --y onto the card */
function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

function CategoryCard({ cat }) {
  const Icon = iconBySlug[cat.slug] ?? Coffee;

  return (
    <Link
      href={`/categories/${cat.slug}`}
      onMouseMove={trackPointer}
      className={`${glass} group relative flex flex-col items-center gap-3.5 rounded-3xl px-3 py-6 sm:py-7 overflow-hidden
        hover:-translate-y-1 hover:border-coffee-400/40 dark:hover:border-coffee-400/25
        transition-all duration-300`}
    >
      {/* spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(180px circle at var(--x, 50%) var(--y, 50%), rgba(190,112,64,0.20), transparent 70%)",
        }}
      />

      {/* corner arrow */}
      <ArrowUpLeft
        size={15}
        strokeWidth={1.75}
        className="absolute top-3.5 left-3.5 text-coffee-500 dark:text-coffee-300
          opacity-0 translate-x-1 translate-y-1
          group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
          transition-all duration-300"
      />

      {/* icon tile */}
      <div
        className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-2xl
          bg-coffee-500/10 dark:bg-white/[0.06]
          text-coffee-600 dark:text-coffee-300
          group-hover:bg-gradient-to-br group-hover:from-coffee-400 group-hover:to-coffee-600
          group-hover:text-white group-hover:border-transparent
          group-hover:shadow-[0_10px_24px_-8px_rgba(190,112,64,0.7)]
          transition-all duration-300"
      >
        {cat.image ? (
          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
        ) : (
          <Icon
            strokeWidth={1.5}
            className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>

      <span className="relative text-xs sm:text-sm font-semibold text-foreground/90 group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors text-center leading-tight">
        {cat.name}
      </span>
    </Link>
  );
}

export default function FeaturedCategories() {
  const reduce = useReducedMotion();

  const { data: cats, isLoading } = useQuery({
    queryKey: ["featured-categories"],
    queryFn: () =>
      axios.get("/api/categories?featured=true&parent=root").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const items = cats?.length ? cats : defaultCats;

  return (
    <section className="relative pt-16 md:pt-24 pb-10 dark:bg-background overflow-x-hidden md:overflow-x-visible">
      {/* Glow layer */}
      <div aria-hidden className="pointer-events-none absolute overflow-visible">
        <div className="absolute -top-20 right-[8%] h-[360px] w-[360px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[100px]" />
        <div className="absolute -bottom-24 left-[6%] h-[320px] w-[320px] rounded-full bg-coffee-300/50 dark:bg-coffee-700/[0.12] blur-[100px] z-10" />
      </div>


      <div className="container-custom relative">
        {/* Header */}
        <SectionHeader
          title="دسته‌بندی‌های محبوب"
          subtitle="سبک مورد علاقه‌ات را پیدا کن"
          href="/categories"
        />

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`${glass} flex flex-col items-center gap-3.5 rounded-3xl px-3 py-6 sm:py-7`}
              >
                <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
            : items.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CategoryCard cat={cat} />
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}