"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left  = page - delta;
  const right = page + delta + 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) pages.push(i);
  }

  const result = [];
  let prev;
  for (const p of pages) {
    if (prev && p - prev !== 1) result.push("...");
    result.push(p);
    prev = p;
  }

  const btnBase = "h-9 w-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150";

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6" dir="rtl" aria-label="صفحه‌بندی">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(btnBase, "border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed")}
        aria-label="صفحه قبل"
      >
        <ChevronRight size={16} />
      </button>

      {result.map((item, i) =>
        item === "..." ? (
          <span key={`dot-${i}`} className="h-9 w-9 flex items-center justify-center text-muted-foreground text-sm">
            ···
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              btnBase,
              item === page
                ? "bg-coffee-600 dark:bg-coffee-500 text-white shadow-warm"
                : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {formatNumber(item)}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(btnBase, "border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed")}
        aria-label="صفحه بعد"
      >
        <ChevronLeft size={16} />
      </button>
    </nav>
  );
}
