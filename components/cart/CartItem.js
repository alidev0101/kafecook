"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_IMG = "/images/default-product.svg";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleRemove = () => {
    removeItem(item.id);
    toast.success("محصول از سبد حذف شد");
  };

  return (
    <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
      {/* Image */}
      <Link href={`/products/${item.productSnapshot?.slug}`} className="flex-shrink-0">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-muted overflow-hidden relative">
          <Image
            src={item.productSnapshot?.image || DEFAULT_IMG}
            alt={item.productSnapshot?.name || "محصول"}
            fill
            className="object-cover"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productSnapshot?.slug}`}
          className="text-sm font-semibold text-foreground hover:text-coffee-700 dark:hover:text-coffee-400 line-clamp-2 block transition-colors"
        >
          {item.productSnapshot?.name}
        </Link>
        {(item.productSnapshot?.weightLabel || item.productSnapshot?.grindLabel) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.productSnapshot.weightLabel}
            {item.productSnapshot.grindLabel && ` — ${item.productSnapshot.grindLabel}`}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-0.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg hover:bg-card flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
            >
              {item.quantity === 1
                ? <Trash2 size={12} className="text-red-400" />
                : <Minus size={12} />
              }
            </motion.button>
            <span className="w-7 text-center text-sm font-bold text-foreground">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-lg hover:bg-card flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
            >
              <Plus size={12} />
            </motion.button>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.comparePrice > item.price && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(item.comparePrice)}</p>
            )}
            <p className="text-sm font-bold text-coffee-700 dark:text-coffee-400">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>

      {/* Remove */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleRemove}
        className="p-1.5 text-muted-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
        aria-label="حذف"
      >
        <Trash2 size={15} />
      </motion.button>
    </div>
  );
}
