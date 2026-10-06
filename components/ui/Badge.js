import { cn } from "@/lib/utils";

const variants = {
  default: "bg-muted text-muted-foreground",
  primary: {
    light: "bg-coffee-100 text-coffee-700",
    dark: "bg-coffee-100 dark:bg-coffee-900/40 text-coffee-700 dark:text-coffee-300",
  },
  success: {
    light: "bg-green-100 text-green-700",
    dark: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  warning: {
    light: "bg-yellow-100 text-yellow-700",
    dark: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  },
  danger: {
    light: "bg-red-100 text-red-700",
    dark: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
  info: {
    light: "bg-blue-100 text-blue-700",
    dark: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  purple: {
    light: "bg-purple-100 text-purple-700",
    dark: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  gold: {
    light: "bg-amber-100 text-amber-700",
    dark: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  },
  discount: "bg-rose-50 text-rose-600 border border-rose-200/70",
  new: "bg-coffee-500 text-white",
  outOfStock: {
    light: "bg-gray-400 text-white",
    dark: "bg-gray-400 dark:bg-gray-600 text-white",
  },
};

export default function Badge({
  children,
  variant = "default",
  darkmode = true,
  className,
  ...props
}) {
  const variantClasses = variants[variant];

  const colorClasses =
    typeof variantClasses === "string"
      ? variantClasses
      : variantClasses?.[darkmode ? "dark" : "light"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        colorClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}