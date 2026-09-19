"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ rating = 0, max = 5, size = "sm", showValue = false, interactive = false, onChange, className }) {
  const px = { xs: 10, sm: 14, md: 18, lg: 22 }[size] ?? 14;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange?.(i + 1) : undefined}
            tabIndex={interactive ? 0 : -1}
            className={cn(interactive && "hover:scale-110 cursor-pointer transition-transform")}
          >
            <Star
              size={px}
              className={cn(
                "transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30",
                interactive && !filled && "hover:fill-amber-300 hover:text-amber-300"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground mr-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
