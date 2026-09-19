import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-coffee-600 hover:bg-coffee-700 text-white shadow-warm hover:shadow-warm-lg",
  secondary: "bg-cream-100 hover:bg-cream-200 text-coffee-800 border border-cream-300",
  outline: "border-2 border-coffee-600 text-coffee-600 hover:bg-coffee-600 hover:text-white bg-transparent",
  ghost: "text-coffee-600 hover:bg-coffee-50 bg-transparent",
  destructive: "bg-red-500 hover:bg-red-600 text-white",
  gold: "bg-gradient-to-r from-yellow-600 to-amber-500 text-white hover:from-yellow-700 hover:to-amber-600",
};

const sizes = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-5 text-sm rounded-xl",
  lg: "h-12 px-7 text-base rounded-xl",
  xl: "h-14 px-8 text-lg rounded-2xl",
  icon: "h-10 w-10 rounded-xl",
  "icon-sm": "h-8 w-8 rounded-lg",
};

const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-500 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
