"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleRemove = () => {
    removeItem(item.id);
    toast.success("محصول از سبد حذف شد");
  };

  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <Link href={`/products/${item.productSnapshot?.slug}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-xl bg-cream-50 overflow-hidden relative">
          {item.productSnapshot?.image ? (
            <Image
              src={item.productSnapshot.image}
              alt={item.productSnapshot?.name || ""}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">☕</div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productSnapshot?.slug}`}
          className="text-sm font-semibold text-gray-800 hover:text-coffee-700 line-clamp-2 block"
        >
          {item.productSnapshot?.name}
        </Link>
        {item.productSnapshot?.weightLabel && (
          <p className="text-xs text-gray-400 mt-0.5">
            {item.productSnapshot.weightLabel}
            {item.productSnapshot.grindLabel && ` — ${item.productSnapshot.grindLabel}`}
          </p>
        )}

        <div className="flex items-center justify-between mt-2.5">
          {/* Quantity */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center transition-colors text-gray-500 hover:text-coffee-700"
            >
              {item.quantity === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} />}
            </button>
            <span className="w-7 text-center text-sm font-semibold text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-md hover:bg-white flex items-center justify-center transition-colors text-gray-500 hover:text-coffee-700"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.comparePrice > item.price && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(item.comparePrice)}</p>
            )}
            <p className="text-sm font-bold text-coffee-700">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        className="p-1.5 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="حذف"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
