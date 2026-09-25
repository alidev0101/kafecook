import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { DEFAULT_IMG } from "@/lib/constants";

export default function RelatedPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <h2
        className="text-xl font-black text-foreground mb-6"
        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
      >
        مقالات مرتبط
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, 3).map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="aspect-[16/9] relative bg-muted overflow-hidden">
                <Image
                  src={post.featuredImage?.url || DEFAULT_IMG}
                  alt={post.featuredImage?.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width:640px) 100vw, 33vw"
                  onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                />
                {post.category && (
                  <span
                    className="absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: post.category.color || "#be7040" }}
                  >
                    {post.category.name}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3
                  className="font-bold text-sm text-foreground group-hover:text-coffee-600 dark:group-hover:text-coffee-400 transition-colors line-clamp-2 leading-snug mb-2"
                  style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                >
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} /> {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {formatNumber(post.readTime)} دقیقه
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
