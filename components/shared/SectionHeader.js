import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeader({ title, subtitle, href, hrefLabel = "مشاهده همه", className }) {
  const reduce = useReducedMotion();

  const glass =
    "bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl " +
    "border border-white/80 dark:border-white/[0.08] " +
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_12px_32px_-16px_rgba(90,50,20,0.22)] " +
    "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.65)]";

  return (
    <div className={cn("flex items-end justify-between gap-4 mb-9 w-full", className)}>
      <div>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="section-title"
        >
          {title}
        </motion.h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className={`${glass} group shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-medium
              text-coffee-700 dark:text-coffee-300 hover:border-coffee-400/40 transition-all duration-300`}
        >
          {hrefLabel}
          <ArrowLeft
            size={14}
            strokeWidth={1.75}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
