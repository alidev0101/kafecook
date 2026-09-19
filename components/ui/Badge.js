import { cn } from "@/lib/utils";

const variants = {
  default:    "bg-muted text-muted-foreground",
  primary:    "bg-coffee-100 dark:bg-coffee-900/40 text-coffee-700 dark:text-coffee-300",
  success:    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  warning:    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  danger:     "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  info:       "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  purple:     "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  gold:       "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  discount:   "bg-red-500 text-white",
  new:        "bg-coffee-500 text-white",
  outOfStock: "bg-gray-400 dark:bg-gray-600 text-white",
};

export default function Badge({ children, variant = "default", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
