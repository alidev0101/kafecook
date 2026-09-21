import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, Tag } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

const DEFAULT_IMG = "/images/default-product.svg";

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
        className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full"
        aria-label={post.title}
      >
        {/* Featured Image */}
        <div className={`relative overflow-hidden bg-muted/30 ${featured ? "aspect-[16/7]" : "aspect-[16/9]"}`}>
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
          {/* Type badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
          </div>
          {/* Category */}
          {post.category && (
            <div className="absolute bottom-3 right-3">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
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
            className={`font-bold text-foreground group-hover:text-coffee-700 dark:group-hover:text-coffee-400 transition-colors leading-snug mb-2 line-clamp-2 ${featured ? "text-xl md:text-2xl" : "text-base"}`}
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border flex-wrap">
            {post.author?.name && (
              <span className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center text-[10px] font-bold text-coffee-600">
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
