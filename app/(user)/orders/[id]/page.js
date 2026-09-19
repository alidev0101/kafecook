"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, Truck, CreditCard, ArrowRight, Clock } from "lucide-react";
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
          <div className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-black text-gray-900 font-mono" dir="ltr">
                    #{order.orderNumber}
                  </h1>
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                <p className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</p>
              </div>
              {order.trackingCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-gray-500 text-xs">کد رهگیری: </span>
                  <span className="font-bold text-blue-700" dir="ltr">{order.trackingCode}</span>
                </div>
              )}
            </div>

            {/* Progress */}
            {order.status !== "cancelled" && (
              <div className="mt-6">
                <div className="flex items-center">
                  {["ثبت شد", "پردازش", "ارسال", "تحویل"].map((label, i) => (
                    <div key={i} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          i <= currentStep ? "bg-coffee-600 text-white" : "bg-gray-200 text-gray-400"
                        }`}>
                          {i < currentStep ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs whitespace-nowrap ${i <= currentStep ? "text-coffee-600 font-medium" : "text-gray-400"}`}>
                          {label}
                        </span>
                      </div>
                      {i < 3 && (
                        <div className={`flex-1 h-0.5 mx-1 transition-all ${i < currentStep ? "bg-coffee-500" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={18} className="text-coffee-500" /> محصولات سفارش
            </h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 rounded-xl bg-cream-50 flex-shrink-0 overflow-hidden relative">
                    {item.productSnapshot?.image ? (
                      <Image src={item.productSnapshot.image} alt={item.productSnapshot.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl opacity-20">☕</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.productSnapshot?.name}</p>
                    {item.productSnapshot?.weightLabel && (
                      <p className="text-xs text-gray-400">{item.productSnapshot.weightLabel}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatNumber(item.quantity)} عدد × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-coffee-700 text-sm whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Address */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-coffee-500" /> آدرس تحویل
              </h2>
              <div className="text-sm text-gray-600 space-y-1.5">
                <p className="font-semibold text-gray-800">{order.shippingAddress?.recipientName}</p>
                <p dir="ltr" className="text-right">{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.province}، {order.shippingAddress?.city}، {order.shippingAddress?.street}</p>
                {order.shippingAddress?.buildingNumber && <p>پلاک {order.shippingAddress.buildingNumber}{order.shippingAddress.unit ? `، واحد ${order.shippingAddress.unit}` : ""}</p>}
                <p className="text-xs text-gray-400">کد پستی: <span dir="ltr">{order.shippingAddress?.postalCode}</span></p>
              </div>
            </div>

            {/* Payment summary */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-coffee-500" /> خلاصه پرداخت
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع محصولات</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال ({order.shippingMethodLabel})</span>
                  <span>{order.shippingCost === 0 ? "رایگان" : formatPrice(order.shippingCost)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                  <span>مجموع</span>
                  <span className="text-coffee-700">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-coffee-500" /> تاریخچه وضعیت
              </h2>
              <div className="space-y-3">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-coffee-400 mt-2 flex-shrink-0" />
                    <div>
                      <OrderStatusBadge status={h.status} />
                      {h.note && <p className="text-gray-500 mt-1 text-xs">{h.note}</p>}
                      <p className="text-gray-400 text-xs mt-1">{formatDateTime(h.changedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Link href="/orders" className="flex items-center gap-2 text-sm text-coffee-600 hover:underline">
              <ArrowRight size={15} /> بازگشت به لیست سفارش‌ها
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
