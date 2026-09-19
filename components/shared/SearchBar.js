"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatPrice } from "@/lib/utils";

const suggestions = ["اسپرسو", "کلمبیا", "اتیوپی", "لاته", "فرنچ پرس"];

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data: results } = useQuery({
    queryKey: ["search-preview", query],
    queryFn: () =>
      axios
        .get(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
        .then((r) => r.data.data),
    enabled: query.trim().length >= 2,
    staleTime: 30000,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleSuggestion = (s) => {
    router.push(`/search?q=${encodeURIComponent(s)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search size={20} className="text-coffee-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی قهوه، برند، دسته‌بندی..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </form>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                <TrendingUp size={13} /> جستجوهای محبوب
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="px-3 py-1.5 bg-coffee-50 hover:bg-coffee-100 text-coffee-700 text-sm rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => { router.push(`/products/${product.slug}`); onClose(); }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-coffee-50 transition-colors text-right"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                    {product.images?.[0]?.url ? (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">☕</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-coffee-600 mt-0.5">{formatPrice(product.basePrice)}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); onClose(); }}
                className="w-full text-center text-sm text-coffee-600 hover:text-coffee-800 py-2.5 font-medium border-t border-gray-100 mt-2"
              >
                مشاهده همه نتایج برای "{query}"
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-6">نتیجه‌ای یافت نشد</p>
          )}
        </div>
      </div>
    </div>
  );
}
