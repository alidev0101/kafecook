"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  rating = 0,
  max = 5,
  size = "sm",
  showValue = false,
  interactive = false,
  onChange,
  className,
}) {
  const sizes = { xs: 10, sm: 14, md: 18, lg: 22 };
  const starSize = sizes[size] || 14;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange?.(i + 1) : undefined}
            className={cn(
              "transition-transform",
              interactive && "hover:scale-110 cursor-pointer"
            )}
          >
            <Star
              size={starSize}
              className={cn(
                "transition-colors",
                filled || partial
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200",
                interactive && !filled && "hover:fill-amber-300 hover:text-amber-300"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm font-medium text-gray-600 mr-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
