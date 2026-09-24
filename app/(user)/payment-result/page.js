"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Package, ShoppingBag, Home, Banknote } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const clearCart = useCartStore((s) => s.clearCart);

  const isSuccess = status === "success";
  const isCod = status === "cod";
  const isFailed = status === "failed";
  const isOrderCreated = isSuccess || isCod;

  useEffect(() => {
    if (isOrderCreated) clearCart();
  }, [isOrderCreated, clearCart]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md w-full bg-card border border-border rounded-3xl shadow-card-hover p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isOrderCreated
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-red-100 dark:bg-red-900/30"
        }`}
      >
        {isOrderCreated ? (
          <CheckCircle size={48} className="text-green-500" />
        ) : (
          <XCircle size={48} className="text-red-500 dark:text-red-400" />
        )}
      </motion.div>

      <h1
        className="text-2xl font-black text-foreground mb-3"
        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
      >
        {isSuccess
          ? "پرداخت با موفقیت انجام شد! 🎉"
          : isCod
            ? "سفارش با موفقیت ثبت شد! 🎉"
            : "پرداخت ناموفق"}
      </h1>

      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {isSuccess
          ? "پرداخت شما با موفقیت انجام شد و سفارش در حال آماده‌سازی است."
          : isCod
            ? "سفارش شما ثبت شد و مبلغ آن هنگام تحویل کالا دریافت خواهد شد."
            : "متأسفانه پرداخت انجام نشد. لطفاً دوباره تلاش کنید."}
      </p>

      {isOrderCreated && orderNumber && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-5 py-3 mb-6">
          <p className="text-xs text-muted-foreground mb-1">شماره سفارش</p>
          <p className="text-lg font-black text-green-700 dark:text-green-400 font-mono" dir="ltr">
            #{orderNumber}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {isOrderCreated ? (
          <>
            <Link href={`/orders/${orderId}`}>
              <Button size="lg" className="w-full">
                <Package size={17} /> مشاهده سفارش
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="secondary" size="lg" className="w-full">
                <ShoppingBag size={17} /> ادامه خرید
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/checkout">
              <Button size="lg" className="w-full">تلاش مجدد</Button>
            </Link>

            <Link href="/">
              <Button variant="secondary" size="lg" className="w-full">
                <Home size={17} /> بازگشت به خانه
              </Button>
            </Link>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        نیاز به کمک دارید؟{" "}
        <Link href="/contact" className="text-coffee-600 dark:text-coffee-400 hover:underline">
          تماس با پشتیبانی
        </Link>
      </p>
    </motion.div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="w-full max-w-md h-96 bg-card rounded-3xl animate-pulse border border-border" />}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}