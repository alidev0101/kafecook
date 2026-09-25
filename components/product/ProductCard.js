"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn, formatPrice, calcDiscount, formatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Badge from "@/components/ui/Badge";
import { DEFAULT_IMG } from "@/lib/constants";

export default function ProductCard({ product, className }) {
  const { addItem, items }       = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const image        = product.images?.find((i) => i.isPrimary) || product.images?.[0];
  const firstVariant = product.variants?.[0];
  const price        = firstVariant?.price   ?? product.basePrice         ?? 0;
  const comparePrice = firstVariant?.comparePrice ?? product.baseComparePrice ?? null;
  const discount     = calcDiscount(comparePrice, price);
  const inCart       = items.some((i) => i.productId === product._id?.toString());
  const wishlisted   = isWishlisted(product._id?.toString());
  const isOutOfStock = product.variants?.length > 0 && product.variants.every((v) => v.stock === 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product._id?.toString(),
      variantId: firstVariant?._id?.toString(),
      price,
      comparePrice,
      productSnapshot: {
        name:        product.name,
        image:       image?.url || null,
        slug:        product.slug,
        weightLabel: firstVariant?.weightLabel,
        grindLabel:  firstVariant?.grindLabel,
      },
    });
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id?.toString());
    toast.success(wishlisted ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="card-product flex flex-col h-full"
        aria-label={product.name}
      >
        {/* ── Image ── */}
        <div className="relative aspect-square overflow-hidden bg-muted/40 dark:bg-muted/20">
          <Image
            src={image?.url || DEFAULT_IMG}
            alt={image?.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
          />

          {/* Badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            {discount > 0 && <Badge variant="discount">-{formatNumber(discount)}٪</Badge>}
            {product.isNew && !discount && <Badge variant="new">جدید</Badge>}
            {product.isBestSeller && !discount && !product.isNew && (
              <Badge variant="gold">پرفروش</Badge>
            )}
            {isOutOfStock && <Badge variant="outOfStock">ناموجود</Badge>}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleWishlist}
              aria-label="افزودن به علاقه‌مندی"
              className={cn(
                "w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-all",
                wishlisted
                  ? "bg-red-500 text-white"
                  : "bg-card/90 text-muted-foreground hover:bg-card"
              )}
            >
              <Heart size={14} className={wishlisted ? "fill-white" : ""} />
            </motion.button>

            {/* <Link
              href={`/products/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              aria-label="مشاهده سریع"
              className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-muted-foreground hover:bg-card hover:text-foreground transition-all"
            >
              <Eye size={14} />
            </Link> */}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/50 dark:bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground bg-card/80 px-3 py-1 rounded-full">
                ناموجود
              </span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-3.5 flex flex-col flex-1">
          {/* Brand */}
          {product.brand?.name && (
            <p className="text-[11px] text-coffee-500 dark:text-coffee-400 font-medium mb-1 truncate">
              {product.brand.name}
            </p>
          )}

          {/* Name */}
          <h3
            className="text-sm font-semibold text-foreground line-clamp-2 mb-1.5 leading-snug flex-1"
            style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewsCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                {product.averageRating?.toFixed(1)}
                <span className="opacity-60 mr-0.5">({formatNumber(product.reviewsCount)})</span>
              </span>
            </div>
          )}

          {/* Price + Cart btn */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <div>
              {comparePrice > price && (
                <p className="text-[11px] text-muted-foreground line-through mb-0.5">
                  {formatPrice(comparePrice)}
                </p>
              )}
              <p className={cn("text-sm font-bold", isOutOfStock ? "text-muted-foreground" : "text-coffee-700 dark:text-coffee-400")}>
                {isOutOfStock ? "ناموجود" : formatPrice(price)}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label="افزودن به سبد"
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                isOutOfStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : inCart
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "bg-coffee-600 dark:bg-coffee-500 text-white hover:bg-coffee-700 dark:hover:bg-coffee-600 shadow-warm"
              )}
            >
              <ShoppingCart size={15} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
