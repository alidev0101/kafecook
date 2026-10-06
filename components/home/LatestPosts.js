"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeader from "@/components/shared/SectionHeader";
import { DEFAULT_IMG } from "@/lib/constants";
import UniversalSlider from "../shared/UniversalSlider";

function PostMiniCard({ post, index, reduce }) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="glass group block rounded-3xl overflow-hidden transition-all duration-300 h-full
          hover:border-coffee-400/40 dark:hover:border-coffee-400/25"
        aria-label={post.title}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-coffee-500/5 dark:bg-white/[0.04] m-2 mb-0 rounded-2xl">
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
              className="absolute top-2.5 right-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full text-white backdrop-blur-md"
              style={{ backgroundColor: post.category.color || "#be7040" }}
            >
              {post.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-morabba font-bold text-foreground group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors text-sm leading-snug mb-2 line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-black/[0.06] dark:border-white/10 pt-2.5">
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
        <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
          <div className="aspect-[16/9] m-2 mb-0 rounded-2xl bg-muted/60" />
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
  const reduce = useReducedMotion();
  const { data, isLoading } = useQuery({
    queryKey: ["latest-posts-home"],
    queryFn: () =>
      axios.get("/api/posts?sort=newest&limit=3").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  // Don't render section if no posts
  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section className="relative py-16 md:py-20 dark:bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 right-[6%] h-[320px] w-[320px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px]" />
        <div className="absolute bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-amber-300/20 dark:bg-amber-700/[0.12] blur-[110px]" />
      </div>

      <div className="container-custom relative">
        <motion.div initial={reduce ? undefined : { opacity: 0, y: 15 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
          <SectionHeader title="آخرین مقالات وبلاگ" subtitle="آموزش، داستان و راهنمای قهوه از تیم کافه کوک" href="/blog" hrefLabel="همه مقالات" />
        </motion.div>

        {isLoading ? (
          <LatestPostsSkeleton />
        ) : (
          <UniversalSlider
            items={data}
            slidesPerView={1.15}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            renderItem={(post, index) => (
              <PostMiniCard post={post} index={index} reduce={reduce} />
            )}
          />
        )}

        <motion.div initial={reduce ? undefined : { opacity: 0, y: 10 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mt-10">
          <Link href="/blog" className="group inline-flex items-center gap-2 rounded-full border border-coffee-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-coffee-700 shadow-sm transition-all hover:border-coffee-300 hover:bg-coffee-50 dark:border-coffee-800 dark:bg-card dark:text-coffee-300 dark:hover:bg-coffee-950/40">
            <BookOpen size={16} />
            مشاهده همه مقالات
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
