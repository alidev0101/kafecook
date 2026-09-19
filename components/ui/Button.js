import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:     "bg-coffee-600 hover:bg-coffee-700 dark:bg-coffee-500 dark:hover:bg-coffee-600 text-white shadow-warm hover:shadow-warm-lg",
  secondary:   "bg-secondary hover:bg-accent text-secondary-foreground border border-border",
  outline:     "border-2 border-coffee-600 dark:border-coffee-400 text-coffee-600 dark:text-coffee-400 hover:bg-coffee-600 dark:hover:bg-coffee-500 hover:text-white bg-transparent",
  ghost:       "text-foreground hover:bg-accent bg-transparent",
  destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  gold:        "bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white",
};

const sizes = {
  sm:      "h-8 px-3 text-xs rounded-lg gap-1.5",
  md:      "h-10 px-5 text-sm rounded-xl gap-2",
  lg:      "h-12 px-7 text-sm rounded-xl gap-2",
  xl:      "h-14 px-8 text-base rounded-2xl gap-2",
  icon:    "h-10 w-10 rounded-xl",
  "icon-sm":"h-8 w-8 rounded-lg",
};

const Button = forwardRef(function Button(
  { children, className, variant = "primary", size = "md", loading = false, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-3.5 w-3.5 animate-spin flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
