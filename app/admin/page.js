"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import {
  ShoppingBag, Users, Package, TrendingUp,
  AlertCircle, Eye, Clock,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatPrice, formatDate, formatNumber } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => axios.get("/api/admin/stats").then((r) => r.data.data),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const orderColumns = [
    {
      key: "orderNumber",
      title: "شماره سفارش",
      render: (v, row) => (
        <Link href={`/admin/orders/${row._id}`} className="font-mono text-coffee-600 hover:underline font-bold text-xs" dir="ltr">
          #{v}
        </Link>
      ),
    },
    {
      key: "user",
      title: "مشتری",
      render: (v) => <span className="text-sm">{v?.name || "—"}</span>,
    },
    {
      key: "status",
      title: "وضعیت",
      render: (v) => <OrderStatusBadge status={v} />,
    },
    {
      key: "total",
      title: "مبلغ",
      render: (v) => <span className="font-semibold text-gray-800">{formatPrice(v)}</span>,
    },
    {
      key: "createdAt",
      title: "تاریخ",
      render: (v) => <span className="text-gray-400 text-xs">{formatDate(v)}</span>,
    },
    {
      key: "_id",
      title: "",
      render: (v) => (
        <Link href={`/admin/orders/${v}`} className="p-1.5 hover:bg-gray-100 rounded-lg inline-flex text-gray-400 hover:text-gray-700 transition-colors">
          <Eye size={14} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-coffee-gradient rounded-2xl p-6 text-white">
        <h2 className="text-xl font-black mb-1">خوش آمدید به پنل مدیریت ☕</h2>
        <p className="text-coffee-300 text-sm">آخرین آمار و اطلاعات کافه کوک</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <StatCard
              title="فروش امروز"
              value={stats?.sales?.today || 0}
              subtitle="مجموع پرداخت‌های امروز"
              icon={TrendingUp}
              color="green"
              isCurrency
            />
            <StatCard
              title="سفارشات امروز"
              value={stats?.orders?.today || 0}
              subtitle={`مجموع: ${formatNumber(stats?.orders?.total || 0)}`}
              icon={ShoppingBag}
              color="blue"
            />
            <StatCard
              title="کاربران"
              value={stats?.users?.total || 0}
              subtitle="کاربران ثبت‌نام کرده"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="محصولات"
              value={stats?.products?.total || 0}
              subtitle={`${formatNumber(stats?.reviews?.pending || 0)} نظر در انتظار`}
              icon={Package}
              color="orange"
            />
          </>
        )}
      </div>

      {/* This month sales */}
      {!isLoading && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-gray-400 mb-1">فروش این ماه</p>
            <p className="text-2xl font-black text-gray-900">{formatPrice(stats?.sales?.thisMonth || 0)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-gray-400 mb-1">سفارشات این ماه</p>
            <p className="text-2xl font-black text-gray-900">{formatNumber(stats?.orders?.thisMonth || 0)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-gray-400 mb-1">نظرات در انتظار تأیید</p>
            <p className="text-2xl font-black text-gray-900">{formatNumber(stats?.reviews?.pending || 0)}</p>
            {stats?.reviews?.pending > 0 && (
              <Link href="/admin/reviews" className="text-xs text-coffee-600 hover:underline mt-1 inline-block">
                بررسی نظرات ←
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={17} className="text-coffee-500" />
              سفارشات اخیر
            </h2>
            <Link href="/admin/orders" className="text-xs text-coffee-600 hover:underline">
              مشاهده همه
            </Link>
          </div>
          <DataTable
            columns={orderColumns}
            data={stats?.recentOrders}
            loading={isLoading}
          />
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
              <AlertCircle size={17} className="text-orange-500" />
              محصولات کم‌موجود
            </h2>
            <Link href="/admin/products" className="text-xs text-coffee-600 hover:underline">
              همه
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
            </div>
          ) : !stats?.products?.lowStock?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">همه محصولات موجود هستند ✓</p>
          ) : (
            <div className="space-y-2">
              {stats.products.lowStock.map((p) => {
                const minStock = Math.min(...(p.variants?.map((v) => v.stock) || [0]));
                return (
                  <Link
                    key={p._id}
                    href={`/admin/products`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 transition-colors border border-orange-100"
                  >
                    <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full flex-shrink-0 mr-2">
                      {formatNumber(minStock)} عدد
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      {!isLoading && stats?.topProducts?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-bold text-gray-800 mb-4">محصولات پرفروش</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {stats.topProducts.map((p, i) => (
              <div key={p._id} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="w-8 h-8 rounded-full bg-coffee-100 text-coffee-700 font-black text-sm flex items-center justify-center mx-auto mb-2">
                  {i + 1}
                </div>
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{p.name}</p>
                <p className="text-xs text-coffee-600 font-bold">{formatNumber(p.totalSold)} فروش</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
