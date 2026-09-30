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
    <div className="border-b border-black/[0.06] dark:border-white/[0.08] last:border-0">
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

  const optionClass = (active) =>
    cn(
      "w-full text-right text-sm py-2 px-3 rounded-xl transition-all duration-200",
      active
        ? "bg-gradient-to-b from-coffee-400 to-coffee-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_6px_16px_-6px_rgba(190,112,64,0.7)]"
        : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/[0.06] hover:text-foreground"
    );

  return (
    <div className="glass rounded-3xl p-5 sticky top-24">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
          <SlidersHorizontal
            size={16}
            className="text-coffee-600 dark:text-coffee-300"
          />
          فیلترها
        </h3>
        <button
          onClick={() => onFilterChange({})}
          className="text-xs text-coffee-600 dark:text-coffee-300 hover:underline"
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
              className={optionClass(filters.sort === opt.value)}
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
            className={optionClass(!filters.category)}
          >
            همه دسته‌ها
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onFilterChange({ category: cat._id })}
              className={optionClass(filters.category === cat._id)}
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
              className={optionClass(filters.minRating == r)}
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
