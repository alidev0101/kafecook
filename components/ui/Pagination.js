"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = page - delta;
  const right = page + delta + 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i);
    }
  }

  const result = [];
  let prev;
  for (const p of pages) {
    if (prev && p - prev !== 1) result.push("...");
    result.push(p);
    prev = p;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6" dir="rtl">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-coffee-50 hover:border-coffee-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={18} />
      </button>

      {result.map((item, i) =>
        item === "..." ? (
          <span key={`dot-${i}`} className="h-10 w-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all",
              item === page
                ? "bg-coffee-600 text-white shadow-warm"
                : "border border-gray-200 text-gray-600 hover:bg-coffee-50 hover:border-coffee-300"
            )}
          >
            {formatNumber(item)}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-coffee-50 hover:border-coffee-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
      </button>
    </nav>
  );
}
