"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  MapPin, Truck, Tag, CreditCard, ShieldCheck, Plus, CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatPrice, SHIPPING_METHODS } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, coupon, discountAmount, applyCoupon, removeCoupon, syncWithServer } =
    useCartStore();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [couponCode, setCouponCode] = useState(coupon?.code || "");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [notes, setNotes] = useState("");

  const shippingCost =
    subtotal >= 500000
      ? 0
      : SHIPPING_METHODS.find((m) => m.value === shippingMethod)?.price || 35000;
  const finalTotal = subtotal + shippingCost - discountAmount;

  // ─── هنگام ورود به checkout، cart را با سرور sync کن ─────────────────
  useEffect(() => {
    if (items.length > 0) {
      syncWithServer();
    }
  }, []);               // فقط یک بار — وقتی صفحه mount شد

  // ─── بارگذاری آدرس‌ها و انتخاب پیش‌فرض ──────────────────────────────
  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => axios.get("/api/addresses").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (addresses?.length && !selectedAddress) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) setSelectedAddress(def._id);
    }
  }, [addresses]);

  // ─── اعمال کوپن ──────────────────────────────────────────────────────
  const couponMutation = useMutation({
    mutationFn: () =>
      axios
        .post("/api/coupons/validate", { code: couponCode, orderAmount: subtotal })
        .then((r) => r.data.data),
    onSuccess: (data) => {
      applyCoupon({ code: data.code }, data.discountAmount);
      toast.success(`کد تخفیف اعمال شد — ${formatPrice(data.discountAmount)} تخفیف`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "کد تخفیف نامعتبر"),
  });

  // ─── ثبت سفارش ───────────────────────────────────────────────────────
  const orderMutation = useMutation({
    mutationFn: (data) => axios.post("/api/orders", data).then((r) => r.data.data),
    onSuccess: (data) => {
      router.push(
        `/payment-result?orderId=${data.orderId}&orderNumber=${data.orderNumber}&status=success`
      );
    },
    onError: (err) => toast.error(err.response?.data?.message || "خطا در ثبت سفارش"),
  });

  const handlePlaceOrder = () => {
    if (!selectedAddress) { toast.error("لطفاً یک آدرس انتخاب کنید"); return; }
    if (items.length === 0) { toast.error("سبد خرید خالی است"); return; }

    orderMutation.mutate({
      addressId: selectedAddress,
      shippingMethod,
      couponCode: coupon?.code || couponCode || undefined,
      notes,
      paymentMethod,
      // Fallback: اگر cart در DB نبود، از این استفاده می‌شود
      clientItems: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        quantity: i.quantity,
        price: i.price,
        comparePrice: i.comparePrice,
        productSnapshot: i.productSnapshot,
      })),
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: "سبد خرید", href: "/cart" }, { label: "تسویه‌حساب" }]} />

        <h1 className="text-2xl font-bold text-foreground mb-7 mt-2">تسویه‌حساب</h1>

        <div className="flex flex-col lg:flex-row gap-7">
          {/* ─── Left ── */}
          <div className="flex-1 space-y-5">

            {/* 1. آدرس */}
            <CheckSection icon={MapPin} title="۱. آدرس تحویل" iconColor="text-blue-600 bg-blue-100 dark:bg-blue-900/30">
              {addrLoading ? (
                <div className="h-20 bg-muted rounded-xl animate-pulse" />
              ) : !addresses?.length ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm mb-3">هنوز آدرسی ثبت نکرده‌اید</p>
                  <Button variant="outline" size="sm" onClick={() => router.push("/addresses")}>
                    <Plus size={15} /> افزودن آدرس
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddress === addr._id
                          ? "border-coffee-500 bg-coffee-50 dark:bg-coffee-900/20 dark:border-coffee-400"
                          : "border-border hover:border-coffee-300 dark:hover:border-coffee-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="mt-1 accent-coffee-600"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-foreground mb-0.5">
                          {addr.title}
                          {addr.isDefault && (
                            <span className="mr-2 text-xs text-coffee-500 font-normal">پیش‌فرض</span>
                          )}
                        </p>
                        <p className="text-muted-foreground">{addr.recipientName} — {addr.phone}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {addr.province}، {addr.city}، {addr.street}
                          {addr.buildingNumber && `، پلاک ${addr.buildingNumber}`}
                          {addr.unit && `، واحد ${addr.unit}`}
                        </p>
                      </div>
                      {selectedAddress === addr._id && (
                        <CheckCircle size={18} className="text-coffee-500 flex-shrink-0 mt-0.5" />
                      )}
                    </label>
                  ))}
                  <button
                    onClick={() => router.push("/addresses")}
                    className="flex items-center gap-2 text-sm text-coffee-600 dark:text-coffee-400 hover:underline"
                  >
                    <Plus size={14} /> افزودن آدرس جدید
                  </button>
                </div>
              )}
            </CheckSection>

            {/* 2. روش ارسال */}
            <CheckSection icon={Truck} title="۲. روش ارسال" iconColor="text-green-600 bg-green-100 dark:bg-green-900/30">
              <div className="space-y-2">
                {SHIPPING_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === method.value
                        ? "border-coffee-500 bg-coffee-50 dark:bg-coffee-900/20 dark:border-coffee-400"
                        : "border-border hover:border-coffee-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.value}
                        checked={shippingMethod === method.value}
                        onChange={() => setShippingMethod(method.value)}
                        className="accent-coffee-600"
                      />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {subtotal >= 500000 || method.price === 0 ? (
                        <span className="text-green-600">رایگان</span>
                      ) : (
                        formatPrice(method.price)
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </CheckSection>

            {/* 3. کد تخفیف */}
            <CheckSection icon={Tag} title="۳. کد تخفیف" iconColor="text-purple-600 bg-purple-100 dark:bg-purple-900/30">
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>کد <strong>{coupon.code}</strong> — {formatPrice(discountAmount)} تخفیف</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-red-400 hover:text-red-600">
                    حذف
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="کد تخفیف را وارد کنید"
                    className="input-custom flex-1"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => couponMutation.mutate()}
                    loading={couponMutation.isPending}
                    disabled={!couponCode.trim()}
                  >
                    اعمال
                  </Button>
                </div>
              )}
            </CheckSection>

            {/* 4. پرداخت */}
            <CheckSection icon={CreditCard} title="۴. روش پرداخت" iconColor="text-orange-600 bg-orange-100 dark:bg-orange-900/30">
              <div className="space-y-2">
                {[
                  { value: "online", label: "پرداخت آنلاین", desc: "کارت بانکی — درگاه امن" },
                  { value: "cod",    label: "پرداخت در محل", desc: "فقط شهر کرمان" },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === m.value
                        ? "border-coffee-500 bg-coffee-50 dark:bg-coffee-900/20 dark:border-coffee-400"
                        : "border-border hover:border-coffee-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="accent-coffee-600"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CheckSection>

            {/* یادداشت */}
            <div className="card-surface p-5">
              <label className="block text-sm font-medium text-foreground mb-2">یادداشت سفارش (اختیاری)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیحات اضافه..."
                className="input-custom resize-none"
              />
            </div>
          </div>

          {/* ─── Right: Summary ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card-surface p-5 sticky top-24 space-y-5">
              <h2 className="font-bold text-foreground text-base">خلاصه سفارش</h2>

              {/* پیش‌نمایش آیتم‌ها */}
              <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0 overflow-hidden relative">
                      {item.productSnapshot?.image ? (
                        <Image src={item.productSnapshot.image} alt={item.productSnapshot?.name || ""} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl opacity-30">☕</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{item.productSnapshot?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* جمع قیمت */}
              <div className="space-y-2.5 text-sm border-t border-border pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>جمع محصولات</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>تخفیف</span><span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>ارسال</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>
                    {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
                  <span>مجموع</span>
                  <span className="text-coffee-600 dark:text-coffee-400">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                loading={orderMutation.isPending}
                disabled={items.length === 0}
              >
                <ShieldCheck size={17} />
                ثبت سفارش
              </Button>

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-green-500" /> پرداخت کاملاً امن
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckSection({ icon: Icon, title, iconColor, children }) {
  return (
    <div className="card-surface p-5">
      <h2 className="font-bold text-foreground mb-4 flex items-center gap-2.5 text-base">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon size={16} />
        </div>
        {title}
      </h2>
      {children}
    </div>
  );
}
