import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, Tag } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { DEFAULT_IMG } from "@/lib/constants";

const POST_TYPE_LABELS = {
  article:       { label: "مقاله",           color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  tutorial:      { label: "آموزش",           color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  news:          { label: "اخبار",           color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  product_review:{ label: "معرفی محصول",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  brewing_guide: { label: "روش دم‌آوری",   color: "bg-coffee-100 text-coffee-700 dark:bg-coffee-900/30 dark:text-coffee-400" },
};

export default function PostCard({ post, index = 0, featured = false }) {
  const typeConfig = POST_TYPE_LABELS[post.postType] || POST_TYPE_LABELS.article;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={featured ? "lg:col-span-2" : ""}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="glass group block rounded-3xl overflow-hidden transition-all duration-300 h-full
          hover:border-coffee-400/40 dark:hover:border-coffee-400/25"
        aria-label={post.title}
      >
        {/* Featured Image */}
        <div className={`relative overflow-hidden bg-coffee-500/5 dark:bg-white/[0.04] m-2 mb-0 rounded-2xl ${featured ? "aspect-[16/7]" : "aspect-[16/9]"}`}>
          <Image
            src={post.featuredImage?.url || DEFAULT_IMG}
            alt={post.featuredImage?.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={featured
              ? "(max-width:1024px) 100vw, 66vw"
              : "(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            }
            onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
          />
          {/* soft inner sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/10" />
          {/* Type badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
          </div>
          {/* Category */}
          {post.category && (
            <div className="absolute bottom-3 right-3">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white backdrop-blur-md"
                style={{ backgroundColor: post.category.color || "#be7040" }}
              >
                {post.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          <h2
            className={`font-morabba font-bold text-foreground group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors leading-snug mb-2 line-clamp-2 ${featured ? "text-xl md:text-2xl" : "text-base"}`}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-black/[0.06] dark:border-white/10 flex-wrap">
            {post.author?.name && (
              <span className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-b from-coffee-400 to-coffee-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {post.author.name[0]}
                </div>
                {post.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatNumber(post.readTime)} دقیقه
            </span>
            {post.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {formatNumber(post.viewCount)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
