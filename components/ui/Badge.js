import { cn } from "@/lib/utils";

const variants = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-coffee-100 text-coffee-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  gold: "bg-amber-100 text-amber-700",
  discount: "bg-red-500 text-white",
  new: "bg-coffee-500 text-white",
  outOfStock: "bg-gray-400 text-white",
};

export default function Badge({ children, variant = "default", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
