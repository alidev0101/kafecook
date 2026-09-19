"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "rating", label: "بیشترین امتیاز" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export default function ProductFilters({ filters, onFilterChange }) {
  const [openSections, setOpenSections] = useState({
    sort: true, category: true, brand: false, price: false, rating: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axios.get("/api/categories?parent=root").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => axios.get("/api/brands").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const Section = ({ id, title, children }) => (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-gray-700"
      >
        {title}
        {openSections[id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {openSections[id] && <div className="pb-4">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-coffee-600" />
          فیلترها
        </h3>
        <button
          onClick={() => onFilterChange({})}
          className="text-xs text-coffee-600 hover:underline"
        >
          پاک کردن همه
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
                "w-full text-right text-sm py-2 px-3 rounded-lg transition-colors",
                filters.sort === opt.value
                  ? "bg-coffee-600 text-white"
                  : "text-gray-600 hover:bg-coffee-50 hover:text-coffee-700"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section id="category" title="دسته‌بندی">
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: "" })}
            className={cn(
              "w-full text-right text-sm py-2 px-3 rounded-lg transition-colors",
              !filters.category
                ? "bg-coffee-50 text-coffee-700 font-medium"
                : "text-gray-600 hover:bg-coffee-50"
            )}
          >
            همه دسته‌ها
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onFilterChange({ category: cat._id })}
              className={cn(
                "w-full text-right text-sm py-2 px-3 rounded-lg transition-colors",
                filters.category === cat._id
                  ? "bg-coffee-600 text-white"
                  : "text-gray-600 hover:bg-coffee-50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Brands */}
      <Section id="brand" title="برند">
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
          {brands?.map((b) => (
            <label key={b._id} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-coffee-600 rounded cursor-pointer"
                checked={filters.brand === b._id}
                onChange={() =>
                  onFilterChange({
                    brand: filters.brand === b._id ? "" : b._id,
                  })
                }
              />
              <span className="text-sm text-gray-600 group-hover:text-coffee-700 transition-colors">
                {b.name}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section id="price" title="محدوده قیمت">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="از"
              value={filters.minPrice || ""}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-coffee-400"
            />
            <input
              type="number"
              placeholder="تا"
              value={filters.maxPrice || ""}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-coffee-400"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => onFilterChange({ minPrice: filters.minPrice, maxPrice: filters.maxPrice })}
          >
            اعمال
          </Button>
        </div>
      </Section>

      {/* Rating */}
      <Section id="rating" title="حداقل امتیاز">
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => onFilterChange({ minRating: r })}
              className={cn(
                "w-full flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors",
                filters.minRating == r
                  ? "bg-coffee-600 text-white"
                  : "text-gray-600 hover:bg-coffee-50"
              )}
            >
              <span>{"★".repeat(r)}</span>
              <span>و بیشتر</span>
            </button>
          ))}
        </div>
      </Section>

      {/* In Stock */}
      <div className="pt-3.5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-coffee-600 rounded"
            checked={filters.inStock === "true"}
            onChange={(e) =>
              onFilterChange({ inStock: e.target.checked ? "true" : "" })
            }
          />
          <span className="text-sm font-medium text-gray-700">فقط موجود</span>
        </label>
      </div>
    </div>
  );
}
