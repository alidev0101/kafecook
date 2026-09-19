"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice, formatNumber } from "@/lib/utils";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function CartPage() {
  const { items, subtotal, total, discountAmount, coupon, clearCart } = useCartStore();
  const SHIPPING_THRESHOLD = 500000;
  const shippingCost = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 35000;
  const finalTotal = total + shippingCost;
  const remaining = SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "سبد خرید" }]} />

      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingCart size={24} className="text-coffee-600" />
        سبد خرید
        {items.length > 0 && (
          <span className="text-sm font-normal text-gray-400">
            ({formatNumber(items.reduce((s, i) => s + i.quantity, 0))} قلم)
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="سبد خرید خالی است"
          description="محصولات مورد نظر خود را به سبد اضافه کنید"
          action={{ label: "ادامه خرید", href: "/products" }}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-700 text-sm">محصولات</h2>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                  خالی کردن سبد
                </button>
              </div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Free shipping banner */}
            {remaining > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700 flex items-center gap-2">
                <span>🚚</span>
                <span>
                  برای ارسال رایگان،{" "}
                  <strong>{formatPrice(remaining)}</strong> دیگر خرید کنید
                </span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-5 text-base">خلاصه سفارش</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع محصولات</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف {coupon && `(${coupon.code})`}</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingCost === 0 ? "رایگان 🎉" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-base text-gray-900">
                  <span>مجموع</span>
                  <span className="text-coffee-700">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full mt-5">
                  ادامه و تسویه‌حساب
                  <ArrowLeft size={17} />
                </Button>
              </Link>

              <Link
                href="/products"
                className="block text-center text-sm text-gray-400 hover:text-coffee-600 mt-3 transition-colors"
              >
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
