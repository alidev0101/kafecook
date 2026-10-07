"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Tags, Search, Grid3x3, List, Star, ArrowUpLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeader from "@/components/shared/SectionHeader";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 w-full">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در دسته‌بندی‌ها..."
            className="input-custom pr-9 h-10 w-full"
          />
        </div>

        {/* View toggle + result count */}
        <div className="flex items-center justify-start sm:justify-end gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <button
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

          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {filtered ? `${filtered.length} نتیجه` : `${allCategories.length} دسته‌بندی`}
          </p>
        </div>
      </div>
      {/* Tree view */}
      <motion.div
        key="tree"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        {tree.map((root, ri) => (
          <motion.section
            key={root._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: Math.min(ri * 0.05, 0.3),
            }}
            className="mb-12 last:mb-0"
          >
            <SectionHeader
              title={root.name}
              subtitle={root.description}
              href={`/categories/${root.slug}`}
            />

            <div
              className={cn(
                view === "list"
                  ? "space-y-3"
                  : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
              )}
            >
              {view === "list" ? (
                <ListCard
                  category={root}
                  i={0}
                  isFeatured
                />
              ) : (
                <GridCard
                  category={root}
                  i={0}
                  isFeatured
                />
              )}

              {root.children?.map((child, ci) =>
                view === "list" ? (
                  <ListCard
                    key={child._id}
                    category={child}
                    i={ci + 1}
                  />
                ) : (
                  <GridCard
                    key={child._id}
                    category={child}
                    i={ci + 1}
                  />
                )
              )}
            </div>
          </motion.section>
        ))}

        {tree.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              view === "list"
                ? "space-y-3"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            )}
          >
            {allCategories.map((cat, i) =>
              view === "list" ? (
                <ListCard
                  key={cat._id}
                  category={cat}
                  i={i}
                />
              ) : (
                <GridCard
                  key={cat._id}
                  category={cat}
                  i={i}
                />
              )
            )}
          </motion.div>
        )}
      </motion.div>
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        aria-label={`دسته‌بندی ${category.name}`}
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-coffee-300/70 hover:shadow-lg hover:shadow-coffee-900/5 dark:hover:border-coffee-700/60 dark:hover:shadow-black/20",
          isFeatured && "border-coffee-300/70 dark:border-coffee-700/60"
        )}
      >
        {/* Image */}
        <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-coffee-50 via-cream-50 to-coffee-100 dark:from-coffee-950 dark:via-coffee-900/60 dark:to-coffee-800/40">
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

          {/* Soft overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Featured */}
          {isFeatured && (
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-coffee-700 shadow-sm backdrop-blur-md dark:bg-coffee-950/85 dark:text-coffee-200">
              <Star size={11} fill="currentColor" />
              اصلی
            </div>
          )}

        </div>

        {/* Content */}
        <div className="px-3.5 pb-4 pt-2 relative">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="truncate text-sm font-bold text-foreground transition-colors duration-200 group-hover:text-coffee-700 dark:group-hover:text-coffee-300"

            >
              {category.name}
            </h3>


            {/* Hover action */}
            <div className="absolute top-1 left-2.5 flex h-8 w-8 translate-y-2 items-center justify-center rounded-lg bg-white/90 text-coffee-700 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-coffee-950/90 dark:text-coffee-200">
              <ArrowUpLeft size={15} />
            </div>
          </div>

          {category.description && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
              {category.description}
            </p>
          )}
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
        className="glass flex items-center gap-4 p-4 rounded-2xl hover:border-coffee-400/40 dark:hover:border-coffee-400/25 transition-all duration-200 group"
      >
        {/* Icon / Image */}
        <div className="w-14 h-14 rounded-2xl bg-coffee-500/10 dark:bg-white/[0.06] border border-coffee-500/15 dark:border-white/10 flex items-center justify-center overflow-hidden relative flex-shrink-0">
          {category.image ? (
            <Image src={category.image} alt={category.name} fill className="object-cover" />
          ) : (
            <span className="text-2xl">{category.icon || "☕"}</span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-morabba font-bold text-foreground text-sm group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors">
            {category.name}
            {isFeatured && (
              <span className="mr-2 text-[10px] bg-coffee-500/15 dark:bg-white/[0.07] text-coffee-700 dark:text-coffee-300 px-1.5 py-0.5 rounded-full font-normal">
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
