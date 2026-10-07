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
          <div className="glass overflow-hidden rounded-2xl shadow-card">
            <div className="border-b border-border/60 p-5">
              <h2 className="mb-4 text-lg font-bold text-foreground">
                سفارش‌هایم
              </h2>

              {/* Status tabs */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setStatus(tab.value);
                      setPage(1);
                    }}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${status === tab.value
                        ? "bg-coffee-600 text-white shadow-sm shadow-coffee-900/10 dark:bg-coffee-500 dark:shadow-coffee-950/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4 p-5">
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
              <div className="divide-y divide-border/50">
                {data.data.map((order) => (
                  <div
                    key={order._id}
                    className="p-5 transition-colors hover:bg-muted/40 dark:hover:bg-white/[0.025]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="font-mono text-sm font-bold text-foreground"
                            dir="ltr"
                          >
                            #{order.orderNumber}
                          </span>

                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {formatNumber(order.items?.length || 0)} قلم کالا •{" "}
                          <span className="font-semibold text-coffee-700 dark:text-coffee-400">
                            {formatPrice(order.total)}
                          </span>
                        </p>
                      </div>

                      <Link
                        href={`/orders/${order._id}`}
                        className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-coffee-200 bg-coffee-50/50 px-3 py-2 text-sm font-medium text-coffee-700 transition-all hover:border-coffee-400 hover:bg-coffee-100 dark:border-coffee-800/60 dark:bg-coffee-950/30 dark:text-coffee-300 dark:hover:border-coffee-600 dark:hover:bg-coffee-900/40"
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
