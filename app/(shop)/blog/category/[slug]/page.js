"use client";

import { Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import PostGrid, { PostGridSkeleton } from "@/components/blog/PostGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

function CategoryContent() {
  const { slug }     = useParams();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const page         = Number(searchParams.get("page") || 1);

  const { data: cat } = useQuery({
    queryKey: ["blog-category", slug],
    queryFn: () =>
      axios.get(`/api/blog-categories/${slug}`).then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts-cat", slug, page],
    queryFn: () =>
      axios
        .get(`/api/posts?category=${cat?._id}&page=${page}&limit=9`)
        .then((r) => r.data),
    enabled: !!cat?._id,
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb
        items={[
          { label: "وبلاگ", href: "/blog" },
          { label: cat?.name || slug },
        ]}
      />

      {/* Category header */}
      <div className="mb-8 mt-2">
        <div className="flex items-center gap-3 mb-2">
          {cat?.color && (
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
          )}
          <h1
            className="text-2xl md:text-3xl font-black text-foreground"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {cat?.name || slug}
          </h1>
        </div>
        {cat?.description && (
          <p className="text-muted-foreground text-sm">{cat.description}</p>
        )}
        {data?.pagination && (
          <p className="text-sm text-muted-foreground mt-1">
            {formatNumber(data.pagination.total)} مقاله در این دسته
          </p>
        )}
      </div>

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
                router.push(`/blog/category/${slug}?page=${p}`, { scroll: true })
              }
            />
          )}
        </main>
        <div className="lg:w-72 flex-shrink-0">
          <BlogSidebar categoryId={cat?._id?.toString()} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-coffee-600 dark:text-coffee-400 hover:underline">
          <ArrowLeft size={14} /> همه مقالات
        </Link>
      </div>
    </div>
  );
}

export default function BlogCategoryPage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<div className="container-custom py-8"><PostGridSkeleton /></div>}>
        <CategoryContent />
      </Suspense>
    </div>
  );
}
