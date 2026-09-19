import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumb({ items, className }) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm text-gray-500 py-3", className)}
    >
      <Link href="/" className="flex items-center gap-1 hover:text-coffee-600 transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronLeft size={14} className="text-gray-300" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-coffee-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={cn("font-medium", i === items.length - 1 ? "text-gray-800" : "")}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
