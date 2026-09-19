"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Package, Eye } from "lucide-react";
import UserSidebar from "@/components/shared/UserSidebar";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/OrderStatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatPrice, formatDate, formatNumber } from "@/lib/utils";

const STATUS_TABS = [
  { value: "", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function OrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", status, page],
    queryFn: () =>
      axios
        .get(`/api/orders?page=${page}&limit=10${status ? `&status=${status}` : ""}`)
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "سفارش‌هایم" }]} />
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <UserSidebar />
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">سفارش‌هایم</h2>
              {/* Status tabs */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => { setStatus(tab.value); setPage(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      status === tab.value
                        ? "bg-coffee-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : !data?.data?.length ? (
              <EmptyState
                icon={Package}
                title="سفارشی ثبت نشده"
                description="هنوز سفارشی ثبت نکرده‌اید"
                action={{ label: "شروع خرید", href: "/products" }}
              />
            ) : (
              <div className="divide-y divide-gray-50">
                {data.data.map((order) => (
                  <div key={order._id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm font-mono" dir="ltr">
                            #{order.orderNumber}
                          </span>
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(order.items?.length || 0)} قلم کالا •{" "}
                          <span className="font-semibold text-coffee-700">
                            {formatPrice(order.total)}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/orders/${order._id}`}
                        className="flex items-center gap-1.5 text-sm text-coffee-600 hover:text-coffee-800 font-medium whitespace-nowrap border border-coffee-200 hover:border-coffee-400 px-3 py-2 rounded-xl transition-all"
                      >
                        <Eye size={15} />
                        جزئیات
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data?.pagination && (
              <div className="px-5 pb-2">
                <Pagination
                  page={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
