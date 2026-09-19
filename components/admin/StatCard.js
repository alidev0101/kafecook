import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend, isCurrency = false }) {
  const colors = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    coffee: "bg-coffee-50 text-coffee-600",
    red:    "bg-red-50 text-red-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", colors[color] || colors.coffee)}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">
          {isCurrency ? formatPrice(value) : formatNumber(value)}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 mt-1.5 text-xs font-medium", trend >= 0 ? "text-green-600" : "text-red-500")}>
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}% نسبت به دیروز
          </div>
        )}
      </div>
    </div>
  );
}
