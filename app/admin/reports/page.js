"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatPrice, formatNumber } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

const PERSIAN_MONTHS = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

export default function AdminReportsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => axios.get("/api/admin/stats").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const salesChart = stats?.sales?.chart || [];
  const maxSale = Math.max(...salesChart.map((s) => s.total), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">گزارشات فروش</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "فروش امروز", value: stats?.sales?.today, isCurrency: true },
          { label: "فروش این ماه", value: stats?.sales?.thisMonth, isCurrency: true },
          { label: "سفارشات امروز", value: stats?.orders?.today },
          { label: "سفارشات این ماه", value: stats?.orders?.thisMonth },
        ].map(({ label, value, isCurrency }) => (
          <div key={label} className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-black text-gray-900">
                {isCurrency ? formatPrice(value || 0) : formatNumber(value || 0)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Sales chart */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-800 mb-6">فروش ۶ ماه اخیر</h2>
        {isLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : salesChart.length === 0 ? (
          <p className="text-center text-gray-400 py-12">داده‌ای موجود نیست</p>
        ) : (
          <div className="flex items-end gap-3 h-52">
            {salesChart.map((point, i) => {
              const heightPct = Math.max(4, (point.total / maxSale) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className="text-[10px] text-gray-500 font-medium">
                    {formatPrice(point.total).replace(" تومان", "")}
                  </p>
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-coffee-600 to-coffee-400 transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                    title={formatPrice(point.total)}
                  />
                  <p className="text-[10px] text-gray-400 text-center">
                    ماه {formatNumber(point._id?.month)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order status breakdown */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-800 mb-5">توزیع وضعیت سفارشات</h2>
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(stats?.orders?.byStatus || []).map(({ _id, count }) => {
              const labels = {
                pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
                processing: { label: "پردازش", color: "bg-blue-100 text-blue-700" },
                shipped: { label: "ارسال شده", color: "bg-purple-100 text-purple-700" },
                delivered: { label: "تحویل شده", color: "bg-green-100 text-green-700" },
                cancelled: { label: "لغو شده", color: "bg-red-100 text-red-700" },
                refunded: { label: "مسترد", color: "bg-gray-100 text-gray-600" },
              };
              const cfg = labels[_id] || { label: _id, color: "bg-gray-100 text-gray-600" };
              return (
                <div key={_id} className={`rounded-2xl p-4 ${cfg.color}`}>
                  <p className="text-2xl font-black">{formatNumber(count)}</p>
                  <p className="text-sm mt-1">{cfg.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-800 mb-5">محصولات پرفروش</h2>
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : (
          <div className="space-y-3">
            {(stats?.topProducts || []).slice(0, 8).map((p, i) => (
              <div key={p._id} className="flex items-center gap-4">
                <span className="w-6 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <span className="text-xs text-coffee-600 font-bold flex-shrink-0 mr-2">
                      {formatNumber(p.totalSold)} فروش
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-coffee-400 rounded-full"
                      style={{ width: `${(p.totalSold / (stats.topProducts[0]?.totalSold || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{formatPrice(p.totalRevenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
