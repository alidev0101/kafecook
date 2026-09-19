"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/OrderStatusBadge";
import Button from "@/components/ui/Button";
import { formatPrice, formatDate, formatDateTime, formatNumber, ORDER_STATUS } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

const ALLOWED_STATUSES = Object.entries(ORDER_STATUS).map(([value, { label }]) => ({ value, label }));

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [trackingCode, setTrackingCode] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => axios.get(`/api/orders/${id}`).then((r) => r.data.data),
    staleTime: 30 * 1000,
    onSuccess: (data) => {
      setNewStatus(data.status);
      setAdminNotes(data.adminNotes || "");
      setTrackingCode(data.trackingCode || "");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => axios.put(`/api/orders/${id}`, data),
    onSuccess: () => {
      toast.success("سفارش بروزرسانی شد");
      qc.invalidateQueries(["admin-order", id]);
      qc.invalidateQueries(["admin-orders"]);
    },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
  if (!order) return null;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/orders" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowRight size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 font-mono" dir="ltr">#{order.orderNumber}</h1>
          <p className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-800 mb-4">محصولات سفارش</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 rounded-xl bg-cream-50 flex-shrink-0 overflow-hidden relative">
                    {item.productSnapshot?.image ? (
                      <Image src={item.productSnapshot.image} alt={item.productSnapshot.name} fill className="object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">☕</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800">{item.productSnapshot?.name}</p>
                    {item.productSnapshot?.weightLabel && <p className="text-xs text-gray-400">{item.productSnapshot.weightLabel}</p>}
                    <p className="text-xs text-gray-500 mt-0.5">{formatNumber(item.quantity)} عدد × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-bold text-coffee-700">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>جمع</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>تخفیف</span><span>−{formatPrice(order.discountAmount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>ارسال ({order.shippingMethodLabel})</span><span>{order.shippingCost === 0 ? "رایگان" : formatPrice(order.shippingCost)}</span></div>
              <div className="flex justify-between font-bold text-base pt-1.5 border-t border-gray-100"><span>مجموع</span><span className="text-coffee-700">{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-800 mb-3">آدرس تحویل</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{order.shippingAddress?.recipientName}</p>
              <p dir="ltr" className="text-right">{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.province}، {order.shippingAddress?.city}، {order.shippingAddress?.street}</p>
              {order.shippingAddress?.buildingNumber && <p>پلاک {order.shippingAddress.buildingNumber}{order.shippingAddress.unit ? `، واحد ${order.shippingAddress.unit}` : ""}</p>}
              <p className="text-xs text-gray-400">کد پستی: <span dir="ltr">{order.shippingAddress?.postalCode}</span></p>
            </div>
          </div>
        </div>

        {/* Right — Update status */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-800 mb-4">بروزرسانی سفارش</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">وضعیت</label>
                <select className="input-custom h-11" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {ALLOWED_STATUSES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">کد رهگیری</label>
                <input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="کد رهگیری ارسال"
                  dir="ltr"
                  className="input-custom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">یادداشت ادمین</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="یادداشت داخلی..."
                  className="input-custom resize-none"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => updateMutation.mutate({ status: newStatus, adminNotes, trackingCode })}
                loading={updateMutation.isPending}
              >
                <Save size={16} />
                ذخیره تغییرات
              </Button>
            </div>
          </div>

          {/* Status history */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h2 className="font-bold text-gray-800 mb-3 text-sm">تاریخچه</h2>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-coffee-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <OrderStatusBadge status={h.status} />
                      {h.note && <p className="text-gray-400 mt-0.5">{h.note}</p>}
                      <p className="text-gray-300 mt-0.5">{formatDate(h.changedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
