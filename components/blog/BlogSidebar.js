"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tag, Folder, Clock, TrendingUp } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { DEFAULT_IMG } from "@/lib/constants";

function SideSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm">
        <Icon size={15} className="text-coffee-500" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function BlogSidebar({ currentSlug, categoryId }) {
  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => axios.get("/api/blog-categories").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: popularData } = useQuery({
    queryKey: ["posts-popular"],
    queryFn: () =>
      axios.get("/api/posts?sort=popular&limit=5").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentData } = useQuery({
    queryKey: ["posts-recent"],
    queryFn: () =>
      axios.get("/api/posts?sort=newest&limit=4").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      {/* Categories */}
      {categories?.length > 0 && (
        <SideSection title="دسته‌بندی‌ها" icon={Folder}>
          <div className="space-y-1.5">
            <Link
              href="/blog"
              className="flex items-center justify-between py-1.5 px-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <span>همه مقالات</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/blog/category/${cat.slug}`}
                className={`flex items-center justify-between py-1.5 px-2 rounded-xl text-sm transition-colors ${
                  categoryId === cat._id?.toString()
                    ? "bg-coffee-50 dark:bg-coffee-900/20 text-coffee-700 dark:text-coffee-300 font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || "#be7040" }}
                  />
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </SideSection>
      )}

      {/* Popular Posts */}
      {popularData?.length > 0 && (
        <SideSection title="پرخواننده‌ترین" icon={TrendingUp}>
          <div className="space-y-3">
            {popularData
              .filter((p) => p.slug !== currentSlug)
              .slice(0, 4)
              .map((post, i) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="flex gap-3 group">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-muted relative flex-shrink-0">
                    <Image
                      src={post.featuredImage?.url || DEFAULT_IMG}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock size={10} /> {formatNumber(post.readTime)} دقیقه
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </SideSection>
      )}

      {/* Recent Posts */}
      {recentData?.length > 0 && (
        <SideSection title="جدیدترین مقالات" icon={Clock}>
          <div className="space-y-2.5">
            {recentData
              .filter((p) => p.slug !== currentSlug)
              .slice(0, 3)
              .map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="block group">
                  <p className="text-xs font-medium text-foreground group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDate(post.publishedAt)}
                  </p>
                </Link>
              ))}
          </div>
        </SideSection>
      )}

      {/* Tags CTA */}
      <div className="bg-coffee-gradient rounded-2xl p-5 text-white text-center">
        <div className="text-3xl mb-3">☕</div>
        <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>
          عاشق قهوه‌ای؟
        </h3>
        <p className="text-coffee-200 text-xs mb-4 leading-relaxed">
          بهترین قهوه‌های تخصصی را از کافه کوک تجربه کن
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-white text-coffee-800 text-xs font-bold px-4 py-2 rounded-xl hover:bg-cream-100 transition-colors"
        >
          مشاهده محصولات
        </Link>
      </div>
    </aside>
  );
}
