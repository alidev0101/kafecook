"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import PriceRange from "./PriceRange";

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "rating", label: "بیشترین امتیاز" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

const maxAvailablePrice = 5_000_000;

export default function ProductFilters({ filters, onFilterChange }) {
  const [open, setOpen] = useState({
    sort: true,
    category: true,
    brand: false,
    price: false,
    rating: false,
  });
  const priceTimer = useRef(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios.get("/api/categories?parent=root").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => axios.get("/api/brands").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const [priceRange, setPriceRange] = useState([
    Number(filters.minPrice) || 0,
    Number(filters.maxPrice) || maxAvailablePrice,
  ]);

  useEffect(() => {
    return () => clearTimeout(priceTimer.current);
  }, []);

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const Section = ({ id, title, children }) => (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-foreground"
      >
        {title}
        {open[id] ? (
          <ChevronUp size={15} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={15} className="text-muted-foreground" />
        )}
      </button>
      {open[id] && <div className="pb-4">{children}</div>}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
          <SlidersHorizontal
            size={16}
            className="text-coffee-600 dark:text-coffee-400"
          />
          فیلترها
        </h3>
        <button
          onClick={() => onFilterChange({})}
          className="text-xs text-coffee-600 dark:text-coffee-400 hover:underline"
        >
          پاک کردن
        </button>
      </div>

      {/* Sort */}
      <Section id="sort" title="مرتب‌سازی">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ sort: opt.value })}
              className={cn(
                "w-full text-right text-sm py-2 px-3 rounded-xl transition-colors",
                filters.sort === opt.value
                  ? "bg-coffee-600 dark:bg-coffee-500 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section id="category" title="دسته‌بندی">
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: "" })}
            className={cn(
              "w-full text-right text-sm py-2 px-3 rounded-xl transition-colors",
              !filters.category
                ? "bg-coffee-50 dark:bg-coffee-900/30 text-coffee-700 dark:text-coffee-300 font-medium"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            همه دسته‌ها
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onFilterChange({ category: cat._id })}
              className={cn(
                "w-full text-right text-sm py-2 px-3 rounded-xl transition-colors",
                filters.category === cat._id
                  ? "bg-coffee-600 dark:bg-coffee-500 text-white"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Brand */}
      <Section id="brand" title="برند">
        <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-hide">
          {brands?.map((b) => (
            <label
              key={b._id}
              className="flex items-center gap-2.5 py-1 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-3.5 h-3.5 accent-coffee-600 rounded"
                checked={filters.brand === b._id}
                onChange={() =>
                  onFilterChange({
                    brand: filters.brand === b._id ? "" : b._id,
                  })
                }
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {b.name}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section id="price" title="محدوده قیمت">
        <PriceRange
          min={0}
          max={maxAvailablePrice}
          value={priceRange}
          onChange={(range) => {
            setPriceRange(range);
            onFilterChange({
              minPrice: range[0],
              maxPrice: range[1],
            });
          }}
        />
      </Section>

      {/* Rating */}
      <Section id="rating" title="حداقل امتیاز">
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() =>
                onFilterChange({ minRating: filters.minRating == r ? "" : r })
              }
              className={cn(
                "w-full flex items-center gap-2 text-sm py-2 px-3 rounded-xl transition-colors",
                filters.minRating == r
                  ? "bg-coffee-600 dark:bg-coffee-500 text-white"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <span className="text-amber-400">{"★".repeat(r)}</span>
              <span>و بیشتر</span>
            </button>
          ))}
        </div>
      </Section>

      {/* In stock */}
      <div className="pt-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-3.5 h-3.5 accent-coffee-600 rounded"
            checked={filters.inStock === "true"}
            onChange={(e) =>
              onFilterChange({ inStock: e.target.checked ? "true" : "" })
            }
          />
          <span className="text-sm font-medium text-foreground">فقط موجود</span>
        </label>
      </div>
    </div>
  );
}
