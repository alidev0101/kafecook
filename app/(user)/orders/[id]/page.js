"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, Coffee  , CreditCard, ArrowRight, Clock } from "lucide-react";
import UserSidebar from "@/components/shared/UserSidebar";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/OrderStatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatPrice, formatDate, formatDateTime, formatNumber } from "@/lib/utils";

export default function OrderDetailPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => axios.get(`/api/orders/${id}`).then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex gap-6">
          <div className="hidden lg:block w-64"><Skeleton className="h-48 rounded-2xl" /></div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "سفارش‌هایم", href: "/orders" }, { label: order.orderNumber }]} />
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <UserSidebar />
        <main className="flex-1 space-y-5">
          {/* Header */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h1
                    className="font-mono text-xl font-black text-foreground"
                    dir="ltr"
                  >
                    #{order.orderNumber}
                  </h1>

                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>

              {order.trackingCode && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-sm dark:border-blue-900/50 dark:bg-blue-950/20">
                  <span className="text-xs text-muted-foreground">
                    کد رهگیری:{" "}
                  </span>

                  <span
                    className="font-bold text-blue-700 dark:text-blue-300"
                    dir="ltr"
                  >
                    {order.trackingCode}
                  </span>
                </div>
              )}
            </div>

            {/* Progress */}
            {order.status !== "cancelled" && (
              <div className="mt-6">
                <div className="flex items-center">
                  {["ثبت شد", "پردازش", "ارسال", "تحویل"].map((label, i) => (
                    <div key={i} className="flex flex-1 items-center">
                      <div className="flex shrink-0 flex-col items-center gap-1">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${i <= currentStep
                              ? "bg-coffee-600 text-white shadow-sm shadow-coffee-900/15 dark:bg-coffee-500"
                              : "border border-border bg-muted text-muted-foreground"
                            }`}
                        >
                          {i < currentStep ? "✓" : i + 1}
                        </div>

                        <span
                          className={`whitespace-nowrap text-xs ${i <= currentStep
                              ? "font-medium text-coffee-600 dark:text-coffee-400"
                              : "text-muted-foreground"
                            }`}
                        >
                          {label}
                        </span>
                      </div>

                      {i < 3 && (
                        <div
                          className={`mx-1 h-0.5 flex-1 transition-all ${i < currentStep
                              ? "bg-coffee-500 dark:bg-coffee-400"
                              : "bg-border"
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
              <Package size={18} className="text-coffee-500 dark:text-coffee-400" />
              محصولات سفارش
            </h2>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted">
                    {item.productSnapshot?.image ? (
                      <Image
                        src={item.productSnapshot.image}
                        alt={item.productSnapshot.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-coffee-500/40 dark:text-coffee-400/30">
                        <Coffee size={22} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.productSnapshot?.name}
                    </p>

                    {item.productSnapshot?.weightLabel && (
                      <p className="text-xs text-muted-foreground">
                        {item.productSnapshot.weightLabel}
                      </p>
                    )}

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatNumber(item.quantity)} عدد ×{" "}
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-bold text-coffee-700 dark:text-coffee-400">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Address + Payment */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Address */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <MapPin size={18} className="text-coffee-500 dark:text-coffee-400" />
                آدرس تحویل
              </h2>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {order.shippingAddress?.recipientName}
                </p>

                <p dir="ltr" className="text-right">
                  {order.shippingAddress?.phone}
                </p>

                <p>
                  {order.shippingAddress?.province}،{" "}
                  {order.shippingAddress?.city}،{" "}
                  {order.shippingAddress?.street}
                </p>

                {order.shippingAddress?.buildingNumber && (
                  <p>
                    پلاک {order.shippingAddress.buildingNumber}
                    {order.shippingAddress.unit
                      ? `، واحد ${order.shippingAddress.unit}`
                      : ""}
                  </p>
                )}

                <p className="pt-1 text-xs text-muted-foreground">
                  کد پستی:{" "}
                  <span dir="ltr">{order.shippingAddress?.postalCode}</span>
                </p>
              </div>
            </div>

            {/* Payment summary */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <CreditCard
                  size={18}
                  className="text-coffee-500 dark:text-coffee-400"
                />
                خلاصه پرداخت
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>جمع محصولات</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>هزینه ارسال ({order.shippingMethodLabel})</span>
                  <span>
                    {order.shippingCost === 0
                      ? "رایگان"
                      : formatPrice(order.shippingCost)}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>
                      تخفیف {order.couponCode && `(${order.couponCode})`}
                    </span>

                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                  <span>مجموع</span>

                  <span className="text-coffee-700 dark:text-coffee-400">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          {order.statusHistory?.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <Clock
                  size={18}
                  className="text-coffee-500 dark:text-coffee-400"
                />
                تاریخچه وضعیت
              </h2>

              <div className="space-y-3">
                {order.statusHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-coffee-400 dark:bg-coffee-500" />

                    <div>
                      <OrderStatusBadge status={h.status} />

                      {h.note && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {h.note}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {formatDateTime(h.changedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div className="flex justify-end">
            <Link
              href="/orders"
              className="flex items-center gap-2 text-sm font-medium text-coffee-600 transition-colors hover:text-coffee-800 dark:text-coffee-400 dark:hover:text-coffee-300"
            >
              <ArrowRight size={15} />
              بازگشت به لیست سفارش‌ها
            </Link>
          </div>
        </main>

      </div>
    </div>
  );
}
