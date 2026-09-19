"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className, size = "default" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-xl bg-muted animate-pulse",
          size === "sm" ? "w-8 h-8" : "w-10 h-10",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "تغییر به حالت روز" : "تغییر به حالت شب"}
      className={cn(
        "relative rounded-xl transition-all duration-300 flex items-center justify-center",
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
        className
      )}
    >
      <span
        className={cn(
          "absolute transition-all duration-300",
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
      >
        <Sun size={size === "sm" ? 16 : 18} />
      </span>
      <span
        className={cn(
          "absolute transition-all duration-300",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
      >
        <Moon size={size === "sm" ? 16 : 18} />
      </span>
    </button>
  );
}
