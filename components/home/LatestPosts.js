"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeader from "@/components/shared/SectionHeader";

const DEFAULT_IMG = "/images/default-product.svg";

function PostMiniCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full"
        aria-label={post.title}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted/30">
          <Image
            src={post.featuredImage?.url || DEFAULT_IMG}
            alt={post.featuredImage?.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
          />
          {post.category && (
            <span
              className="absolute top-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: post.category.color || "#be7040" }}
            >
              {post.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="font-bold text-foreground group-hover:text-coffee-700 dark:group-hover:text-coffee-400 transition-colors text-sm leading-snug mb-2 line-clamp-2"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/50 pt-2.5">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {formatNumber(post.readTime)} دقیقه
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function LatestPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[16/9] bg-muted" />
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LatestPosts() {
  const { data, isLoading } = useQuery({
    queryKey: ["latest-posts-home"],
    queryFn: () =>
      axios.get("/api/posts?sort=newest&limit=3").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  // Don't render section if no posts
  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="آخرین مقالات وبلاگ"
            subtitle="آموزش، داستان و راهنمای قهوه از تیم کافه کوک"
            href="/blog"
            hrefLabel="همه مقالات"
          />
        </motion.div>

        {isLoading ? (
          <LatestPostsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((post, i) => (
              <PostMiniCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-coffee-600 hover:bg-coffee-700 dark:bg-coffee-500 dark:hover:bg-coffee-600 text-white font-medium rounded-2xl transition-all shadow-warm hover:shadow-warm-lg"
          >
            <BookOpen size={16} />
            مشاهده همه مقالات
            <ArrowLeft size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
