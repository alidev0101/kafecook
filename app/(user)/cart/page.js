"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import Button from "@/components/ui/Button";
import { formatPrice, formatNumber } from "@/lib/utils";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function CartPage() {
  const { items, subtotal, total, discountAmount, coupon, clearCart } = useCartStore();
  const FREE_THRESHOLD = 500000;
  const shippingCost = subtotal >= FREE_THRESHOLD || subtotal === 0 ? 0 : 35000;
  const finalTotal = total + shippingCost;
  const remaining = FREE_THRESHOLD - subtotal;
  const itemsCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-custom py-8">
        <Breadcrumb items={[{ label: "سبد خرید" }]} />

        <h1 className="text-2xl font-black text-foreground mt-2 mb-6 flex items-center gap-2"
          style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>
          <ShoppingCart size={24} className="text-coffee-600 dark:text-coffee-400" />
          سبد خرید
          {itemsCount > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({formatNumber(itemsCount)} قلم)
            </span>
          )}
        </h1>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-5">
                <ShoppingBag size={40} className="text-muted-foreground opacity-40" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">سبد خرید خالی است</h2>
              <p className="text-muted-foreground text-sm mb-6">محصولات مورد نظر خود را اضافه کنید</p>
              <Link href="/products">
                <Button size="lg">ادامه خرید</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-6"
            >
              {/* Items */}
              <div className="flex-1">
                <div className="bg-card border border-border rounded-2xl shadow-card p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-foreground text-sm">محصولات</h2>
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} /> خالی کردن سبد
                    </button>
                  </div>
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Free shipping banner */}
                {remaining > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2"
                  >
                    🚚 برای ارسال رایگان، <strong>{formatPrice(remaining)}</strong> دیگر خرید کنید
                  </motion.div>
                )}
              </div>

              {/* Summary */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-card border border-border rounded-2xl shadow-card p-5 sticky top-24">
                  <h2 className="font-bold text-foreground mb-5 text-base">خلاصه سفارش</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>جمع محصولات</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>تخفیف {coupon && `(${coupon.code})`}</span>
                        <span>−{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>هزینه ارسال</span>
                      <span className={shippingCost === 0 ? "text-green-600 dark:text-green-400 font-medium" : ""}>
                        {shippingCost === 0 ? "رایگان 🎉" : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between font-bold text-base text-foreground">
                      <span>مجموع</span>
                      <span className="text-coffee-700 dark:text-coffee-400">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block mt-5">
                    <Button size="lg" className="w-full">
                      ادامه و تسویه‌حساب <ArrowLeft size={16} />
                    </Button>
                  </Link>

                  <Link href="/products" className="block text-center text-sm text-muted-foreground hover:text-coffee-600 dark:hover:text-coffee-400 mt-3 transition-colors">
                    ادامه خرید
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
