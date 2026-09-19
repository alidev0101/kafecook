"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatPrice } from "@/lib/utils";

const SUGGESTIONS = ["اسپرسو", "کلمبیا", "اتیوپی", "فرنچ پرس", "کولد برو"];
const DEFAULT_IMG = "/images/default-product.svg";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router   = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data: results } = useQuery({
    queryKey: ["search-preview", query],
    queryFn: () =>
      axios.get(`/api/products?search=${encodeURIComponent(query)}&limit=5`).then((r) => r.data.data),
    enabled: query.trim().length >= 2,
    staleTime: 30000,
  });

  const go = (path) => { router.push(path); onClose(); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-b border-border">
          <Search size={18} className="text-coffee-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی قهوه، برند، دسته‌بندی..."
            className="flex-1 text-sm outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          )}
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X size={19} />
          </button>
        </form>

        {/* Results */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                <TrendingUp size={12} /> جستجوهای محبوب
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => go(`/search?q=${encodeURIComponent(s)}`)}
                    className="px-3 py-1.5 bg-muted hover:bg-coffee-50 dark:hover:bg-coffee-900/30 hover:text-coffee-700 dark:hover:text-coffee-300 text-muted-foreground text-sm rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results?.length ? (
            <div className="space-y-1">
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => go(`/products/${product.slug}`)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors text-right"
                >
                  <div className="w-11 h-11 rounded-xl bg-muted overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={product.images?.[0]?.url || DEFAULT_IMG}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-coffee-600 dark:text-coffee-400 mt-0.5">{formatPrice(product.basePrice)}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => go(`/search?q=${encodeURIComponent(query)}`)}
                className="w-full text-center text-sm text-coffee-600 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 py-2.5 font-medium border-t border-border mt-1 transition-colors"
              >
                همه نتایج برای "{query}"
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-6">نتیجه‌ای یافت نشد</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
