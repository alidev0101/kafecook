import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center gap-1 text-xs text-muted-foreground py-2 flex-wrap", className)}>
      <Link href="/" className="flex items-center hover:text-coffee-600 dark:hover:text-coffee-400 transition-colors">
        <Home size={13} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronLeft size={12} className="text-border flex-shrink-0" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-coffee-600 dark:hover:text-coffee-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={cn(i === items.length - 1 ? "text-foreground font-medium" : "")}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
