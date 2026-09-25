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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در برندها..."
            className="input-custom pr-9 h-10"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-xl p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "p-2 rounded-lg transition-all",
              view === "grid"
                ? "bg-card shadow-sm text-coffee-600"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3x3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "p-2 rounded-lg transition-all",
              view === "list"
                ? "bg-card shadow-sm text-coffee-600"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List size={16} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground self-center">
          {filtered.length} برند
        </p>
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
        className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
        aria-label={`برند ${brand.name}`}
      >
        <div className="aspect-[4/3] relative bg-gradient-to-br from-coffee-50 to-cream-100 dark:from-coffee-950 dark:to-coffee-900 overflow-hidden">
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
              <span
                className="text-4xl font-black text-coffee-400 group-hover:scale-110 transition-transform duration-300"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                {brand.name?.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {brand.isFeatured && (
            <div className="absolute top-2 right-2 bg-coffee-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              ویژه
            </div>
          )}
        </div>

        <div className="p-4">
          <h3
            className="font-bold text-foreground text-sm group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {brand.name}
          </h3>

          {brand.origin && (
            <p className="text-xs text-muted-foreground mt-1">
              {brand.origin}
            </p>
          )}

          {brand.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {brand.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 text-xs text-coffee-500 dark:text-coffee-400 font-medium">
            <span>
              {brand.productsCount || 0} محصول
            </span>

            <span className="flex items-center gap-1">
              مشاهده محصولات
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
        className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-coffee-300 dark:hover:border-coffee-700 hover:shadow-card transition-all duration-200 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-coffee-50 dark:bg-coffee-900/30 flex items-center justify-center overflow-hidden relative flex-shrink-0">
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
          <h3
            className="font-bold text-foreground text-sm group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {brand.name}

            {brand.isFeatured && (
              <span className="mr-2 text-[10px] bg-coffee-100 dark:bg-coffee-900/40 text-coffee-600 dark:text-coffee-400 px-1.5 py-0.5 rounded-full font-normal">
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
