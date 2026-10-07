"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, Grid3x3, List, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

export default function BrandsClient({ brands }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const filtered = search.trim()
    ? brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase()) ||
        brand.description?.toLowerCase().includes(search.toLowerCase()) ||
        brand.origin?.toLowerCase().includes(search.toLowerCase())
    )
    : brands;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در برندها..."
            className="input-custom h-10 w-full pr-9"
          />
        </div>

        {/* View + Count */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 items-center gap-1 rounded-xl border border-border/60 bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="نمایش شبکه‌ای"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                view === "grid"
                  ? "bg-card text-coffee-600 shadow-sm dark:text-coffee-300"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              )}
            >
              <Grid3x3 size={16} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="نمایش لیستی"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                view === "list"
                  ? "bg-card text-coffee-600 shadow-sm dark:text-coffee-300"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              )}
            >
              <List size={16} strokeWidth={1.8} />
            </button>
          </div>

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {filtered.length} برند
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${view}-${search}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            view === "list"
              ? "space-y-2"
              : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          )}
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <Tag size={40} className="mx-auto mb-3 opacity-30" />
              <p>برندی با این مشخصات یافت نشد</p>
            </div>
          ) : (
            filtered.map((brand, i) =>
              view === "list" ? (
                <ListCard key={brand._id} brand={brand} i={i} />
              ) : (
                <GridCard key={brand._id} brand={brand} i={i} />
              )
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function GridCard({ brand, i }) {
  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/brands/${brand.slug}`}
        className="glass group block rounded-3xl overflow-hidden transition-all duration-300
          hover:border-coffee-400/40 dark:hover:border-coffee-400/25"
        aria-label={`برند ${brand.name}`}
      >
        <div className="aspect-[4/3] relative m-2 mb-0 rounded-2xl overflow-hidden bg-gradient-to-br from-coffee-100 to-cream-100 dark:from-coffee-900/60 dark:to-coffee-800/40">
          {brand.logo ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Logo */}
              <Link
                href="/"
                className="mb-8 flex items-center justify-center gap-2"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_8px_18px_-8px_rgba(190,112,64,0.7)] transition-shadow">
                  <Image
                    src="/icons/icon-72x72.png"
                    alt="کافه کوک"
                    width={45}
                    height={45}
                  />
                </div>
              </Link>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {brand.isFeatured && (
            <div className="absolute top-2 right-2 bg-gradient-to-b from-coffee-400 to-coffee-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_6px_14px_-4px_rgba(190,112,64,0.7)]">
              ویژه
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-foreground text-lg group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors">
            {brand.name}
          </h3>

          {brand.origin && (
            <p className="text-xs text-muted-foreground mt-1">
              {brand.origin}
            </p>
          )}

          {brand.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 h-10">
              {brand.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 text-xs text-coffee-600 dark:text-coffee-300 font-medium">
            <span>
              {brand.productsCount || 0} محصول
            </span>

            <span className="flex items-center gap-1">
           <span className="hidden md:block">   مشاهده محصولات</span>
              <ChevronLeft size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ListCard({ brand, i }) {
  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        href={`/brands/${brand.slug}`}
        className="glass flex items-center gap-4 p-4 rounded-2xl hover:border-coffee-400/40 dark:hover:border-coffee-400/25 transition-all duration-200 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-coffee-500/10 dark:bg-white/[0.06] border border-coffee-500/15 dark:border-white/10 flex items-center justify-center overflow-hidden relative flex-shrink-0">
          {brand.logo ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <span className="text-xl font-bold text-coffee-500">
              {brand.name?.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-morabba font-bold text-foreground text-sm group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors">
            {brand.name}

            {brand.isFeatured && (
              <span className="mr-2 text-[10px] bg-coffee-500/15 dark:bg-white/[0.07] text-coffee-700 dark:text-coffee-300 px-1.5 py-0.5 rounded-full font-normal">
                ویژه
              </span>
            )}
          </h3>

          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {brand.origin || brand.description || "برند قهوه"}
          </p>

          <span className="text-xs text-muted-foreground">
            {brand.productsCount || 0} محصول
          </span>
        </div>

        <ChevronLeft
          size={16}
          className="text-muted-foreground group-hover:text-coffee-500 transition-colors flex-shrink-0"
        />
      </Link>
    </motion.div>
  );
}
