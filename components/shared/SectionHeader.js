import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionHeader({ title, subtitle, href, hrefLabel = "مشاهده همه", className }) {
  return (
    <div className={cn("flex items-end justify-between mb-6 md:mb-8", className)}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1.5 text-sm font-medium text-coffee-600 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 transition-colors group"
        >
          {hrefLabel}
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
}
