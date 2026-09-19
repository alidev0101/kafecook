"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Tag, Search, Grid3x3, List } from "lucide-react";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

export default function CategoriesClient({ tree, allCategories }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); // grid | list

  const filtered = search.trim()
    ? allCategories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
      )
    : null; // null = show tree

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در دسته‌بندی‌ها..."
            className="input-custom pr-9 h-10"
          />
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setView("grid")}
            className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-card shadow-sm text-coffee-600" : "text-muted-foreground hover:text-foreground")}
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-card shadow-sm text-coffee-600" : "text-muted-foreground hover:text-foreground")}
          >
            <List size={16} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground self-center">
          {filtered ? `${filtered.length} نتیجه` : `${allCategories.length} دسته‌بندی`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {filtered ? (
          /* Search results — flat */
          <motion.div
            key="search"
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
                <p>دسته‌بندی‌ای با این نام یافت نشد</p>
              </div>
            ) : (
              filtered.map((cat, i) =>
                view === "list" ? (
                  <ListCard key={cat._id} category={cat} i={i} />
                ) : (
                  <GridCard key={cat._id} category={cat} i={i} />
                )
              )
            )}
          </motion.div>
        ) : (
          /* Tree view */
          <motion.div key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {tree.map((root, ri) => (
              <div key={root._id} className="mb-12 last:mb-0">
                {/* Root header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center text-xl">
                      {root.icon || "☕"}
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold text-foreground"
                        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                      >
                        {root.name}
                      </h2>
                      {root.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{root.description}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/categories/${root.slug}`}
                    className="flex items-center gap-1 text-sm text-coffee-600 dark:text-coffee-400 hover:underline"
                  >
                    مشاهده همه <ChevronLeft size={14} />
                  </Link>
                </div>

                {/* Children grid */}
                <div
                  className={cn(
                    view === "list"
                      ? "space-y-2"
                      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  )}
                >
                  {/* Parent card itself */}
                  {view === "list" ? (
                    <ListCard category={root} i={0} isFeatured />
                  ) : (
                    <GridCard category={root} i={0} isFeatured />
                  )}
                  {/* Children */}
                  {root.children?.map((child, ci) =>
                    view === "list" ? (
                      <ListCard key={child._id} category={child} i={ci + 1} />
                    ) : (
                      <GridCard key={child._id} category={child} i={ci + 1} />
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Root categories that are standalone (no children structure) */}
            {tree.length === 0 && (
              <div
                className={cn(
                  view === "list"
                    ? "space-y-2"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
                )}
              >
                {allCategories.map((cat, i) =>
                  view === "list" ? (
                    <ListCard key={cat._id} category={cat} i={i} />
                  ) : (
                    <GridCard key={cat._id} category={cat} i={i} />
                  )
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────────────────────── */
function GridCard({ category, i, isFeatured }) {
  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group block rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300",
          isFeatured && "ring-2 ring-coffee-300 dark:ring-coffee-700"
        )}
        aria-label={`دسته‌بندی ${category.name}`}
      >
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gradient-to-br from-coffee-50 to-cream-100 dark:from-coffee-950 dark:to-coffee-900 overflow-hidden">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform duration-300">
                {category.icon || "☕"}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isFeatured && (
            <div className="absolute top-2 right-2 bg-coffee-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              اصلی
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3
            className="font-bold text-foreground text-sm group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2 text-coffee-500 dark:text-coffee-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            مشاهده محصولات <ChevronLeft size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── List Card ─────────────────────────────────────────────────────────── */
function ListCard({ category, i, isFeatured }) {
  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        href={`/categories/${category.slug}`}
        className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-coffee-300 dark:hover:border-coffee-700 hover:shadow-card transition-all duration-200 group"
      >
        {/* Icon / Image */}
        <div className="w-14 h-14 rounded-2xl bg-coffee-50 dark:bg-coffee-900/30 flex items-center justify-center overflow-hidden relative flex-shrink-0">
          {category.image ? (
            <Image src={category.image} alt={category.name} fill className="object-cover" />
          ) : (
            <span className="text-2xl">{category.icon || "☕"}</span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-foreground text-sm group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {category.name}
            {isFeatured && (
              <span className="mr-2 text-[10px] bg-coffee-100 dark:bg-coffee-900/40 text-coffee-600 dark:text-coffee-400 px-1.5 py-0.5 rounded-full font-normal">
                دسته اصلی
              </span>
            )}
          </h3>
          {category.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{category.description}</p>
          )}
        </div>
        <ChevronLeft size={16} className="text-muted-foreground group-hover:text-coffee-500 transition-colors flex-shrink-0" />
      </Link>
    </motion.div>
  );
}
