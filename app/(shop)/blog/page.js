"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, X, BookOpen } from "lucide-react";
import PostGrid, { PostGridSkeleton } from "@/components/blog/PostGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatNumber } from "@/lib/utils";

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const page   = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const sort   = searchParams.get("sort") || "newest";

  const buildQS = (extra = {}) => {
    const p = new URLSearchParams({ page, sort, ...(search ? { search } : {}), ...extra });
    return p.toString();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", page, search, sort],
    queryFn: () =>
      axios.get(`/api/posts?page=${page}&limit=9&sort=${sort}${search ? `&search=${encodeURIComponent(search)}` : ""}`).then((r) => r.data),
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/blog?${buildQS({ search: searchInput.trim(), page: 1 })}`, { scroll: false });
  };

  const SORT_OPTIONS = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
    { value: "popular", label: "پرخواننده" },
  ];

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "وبلاگ" }]} />

      {/* Hero */}
      <div className="text-center mb-10 mt-2">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black text-foreground mb-3"
          style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
        >
          وبلاگ کافه کوک
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-base max-w-xl mx-auto"
        >
          آموزش، معرفی و داستان‌های قهوه — از مزرعه تا فنجان
        </motion.p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative max-w-md">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو در مقالات..."
            className="input-custom pr-9 pl-9"
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(""); router.push("/blog"); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </form>

        <select
          value={sort}
          onChange={(e) => router.push(`/blog?${buildQS({ sort: e.target.value, page: 1 })}`, { scroll: false })}
          className="h-11 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {data?.pagination && (
          <p className="self-center text-sm text-muted-foreground whitespace-nowrap">
            {formatNumber(data.pagination.total)} مقاله
          </p>
        )}
      </div>

      {/* Search result notice */}
      {search && (
        <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen size={14} />
          <span>نتایج جستجو برای: <strong className="text-foreground">"{search}"</strong></span>
          <button onClick={() => router.push("/blog")} className="text-coffee-600 dark:text-coffee-400 hover:underline">
            حذف فیلتر
          </button>
        </div>
      )}

      {/* Layout: posts + sidebar */}
      <div className="flex flex-col lg:flex-row gap-7">
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <PostGridSkeleton count={9} />
          ) : (
            <PostGrid posts={data?.data} />
          )}
          {data?.pagination && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={(p) =>
                router.push(`/blog?${buildQS({ page: p })}`, { scroll: true })
              }
            />
          )}
        </main>
        <div className="lg:w-72 flex-shrink-0">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<div className="container-custom py-8"><PostGridSkeleton /></div>}>
        <BlogContent />
      </Suspense>
    </div>
  );
}
