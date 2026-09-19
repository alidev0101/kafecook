"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Package, ShoppingBag, Home } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // "success" | "failed"
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (status === "success") {
      clearCart();
    }
  }, [status, clearCart]);

  const isSuccess = status === "success";

  return (
    <div className="min-h-[70vh] flex items-center justify-center container-custom py-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-card-hover p-10 text-center">
        {/* Icon */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle size={48} className="text-green-500" />
          ) : (
            <XCircle size={48} className="text-red-400" />
          )}
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-black mb-3 ${
            isSuccess ? "text-gray-900" : "text-gray-800"
          }`}
        >
          {isSuccess ? "سفارش ثبت شد! 🎉" : "پرداخت ناموفق"}
        </h1>

        {/* Message */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {isSuccess
            ? `سفارش شما با موفقیت ثبت شد. به محض آماده شدن، اطلاع‌رسانی خواهیم کرد.`
            : "متأسفانه پرداخت انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید."}
        </p>

        {/* Order number */}
        {isSuccess && orderNumber && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-6">
            <p className="text-xs text-gray-500 mb-1">شماره سفارش</p>
            <p className="text-lg font-black text-green-700 font-mono" dir="ltr">
              #{orderNumber}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isSuccess ? (
            <>
              <Link href={`/orders/${orderId}`}>
                <Button size="lg" className="w-full">
                  <Package size={17} />
                  مشاهده سفارش
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" size="lg" className="w-full">
                  <ShoppingBag size={17} />
                  ادامه خرید
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  تلاش مجدد
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" size="lg" className="w-full">
                  <Home size={17} />
                  بازگشت به خانه
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-6">
          نیاز به کمک دارید؟{" "}
          <Link href="/contact" className="text-coffee-500 hover:underline">
            تماس با پشتیبانی
          </Link>
        </p>
      </div>
    </div>
  );
}
