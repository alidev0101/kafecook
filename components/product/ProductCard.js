"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { cn, formatPrice, calcDiscount, formatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Badge from "@/components/ui/Badge";
import { DEFAULT_IMG } from "@/lib/constants";

/* shared glass surface — same as FeaturedCategories */
const glass =
  "bg-coffee-100/50 dark:bg-white/[0.04] backdrop-blur-xl" +
  "border border-white/80 dark:border-white/[0.08] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_12px_32px_-16px_rgba(90,50,20,0.22)] " +
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.65)]";


export default function ProductCard({ product, className }) {
  const { addItem, items } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const image = product.images?.find((i) => i.isPrimary) || product.images?.[0];
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price ?? product.basePrice ?? 0;
  const comparePrice = firstVariant?.comparePrice ?? product.baseComparePrice ?? null;
  const discount = calcDiscount(comparePrice, price);
  const inCart = items.some((i) => i.productId === product._id?.toString());
  const wishlisted = isWishlisted(product._id?.toString());
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
        name: product.name,
        image: image?.url || null,
        slug: product.slug,
        weightLabel: firstVariant?.weightLabel,
        grindLabel: firstVariant?.grindLabel,
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
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={product.name}
        className={cn(
          glass,
          "relative flex flex-col h-full rounded-3xl inverted-radius !overflow-visible"
        )}
      >
        {/* spotlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(220px circle at var(--x, 50%) var(--y, 30%), rgba(190,112,64,0.16), transparent 70%)",
          }}
        />

        {/* ── Image (inset inside the glass frame) ── */}
        <div className="relative z-10 p-2 pb-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-coffee-500/5 dark:bg-white/[0.04]">
            <Image
              src={image?.url || DEFAULT_IMG}
              alt={image?.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
            />

            {/* soft inner sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.10] via-transparent to-black/10" />

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
              {discount > 0 && <Badge variant="discount" darkmode={false}>- {formatNumber(discount)}٪</Badge>}

              {product.isNew && !discount && <Badge variant="new" darkmode={false}>جدید</Badge>}

              {product.isBestSeller && !discount && !product.isNew && (
                <Badge variant="gold" darkmode={false}>پرفروش</Badge>
              )}
              {isOutOfStock && <Badge variant="outOfStock" darkmode={false}>ناموجود</Badge>}
            </div>

            {/* Quick actions */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                aria-label="افزودن به علاقه‌مندی"
                className={cn(
                  "w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center",
                  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_6px_16px_-6px_rgba(0,0,0,0.35)] transition-all",
                  wishlisted
                    ? "bg-red-500/90 border-red-400/50 text-white"
                    : "bg-white/70 dark:bg-white/10 border-white/70 dark:border-white/15 text-muted-foreground hover:text-coffee-600 dark:hover:text-coffee-300"
                )}
              >
                <Heart size={14} strokeWidth={1.75} className={wishlisted ? "fill-white" : ""} />
              </motion.button>
            </div>

            <div className="absolute bottom-2.5 left-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-2">
                {/* Rating */}
                {product.reviewsCount > 0 && (
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/70 px-2 py-0.5">
                      <Star size={11} className="fill-amber-400 text-amber-400 mb-1" />
                      <span className="text-xs text-amber-700">
                        {product.averageRating?.toFixed(1)}
                        <span className="opacity-60 mr-0.5">({formatNumber(product.reviewsCount)})</span>
                      </span>
                    </span>
                  </div>
                )}

                {/* Brand */}
                {product.brand?.name && (
                  <p className="text-[11px] text-coffee-700 bg-coffee-50 border border-coffee-200/70 px-2 py-0.5 rounded-full font-bold truncate">
                    {product.brand.name}
                  </p>
                )}
              </div>
            </div>


            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/45 dark:bg-background/55 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/70 dark:border-white/15 px-3 py-1 rounded-full">
                  ناموجود
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 px-4 pt-3.5 pb-4 flex flex-col flex-1">

          {/* Name */}
          <h3 className="text-md font-semibold text-foreground/95 line-clamp-1 mb-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-foreground/70 line-clamp-2 mb-2 leading-snug">
            {product.description}
          </p>
          {/* Price */}
          <div className="mt-auto flex h-12 min-h-12 flex-col justify-end gap-0.5 pt-2">
            {comparePrice > price ? (
              <p className="text-[10px] sm:text-[11px] text-red-600/70 line-through whitespace-nowrap leading-4">
                {formatPrice(comparePrice)}
              </p>
            ) : (
              <div className="h-4" />
            )}

            <p
              className={cn(
                "text-xs sm:text-sm font-bold whitespace-nowrap leading-5",
                isOutOfStock
                  ? "text-muted-foreground"
                  : "text-coffee-700 dark:text-coffee-300"
              )}
            >
              {isOutOfStock ? "ناموجود" : formatPrice(price)}
            </p>
          </div>


        </div>


      </Link>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        aria-label="افزودن به سبد"
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 absolute left-1 bottom-1 z-20",
          isOutOfStock
            ? "bg-muted/70 text-muted-foreground cursor-not-allowed"
            : inCart
              ? "bg-green-500/15 border border-green-500/25 text-green-600 dark:text-green-400"
              : cn(
                "text-white bg-gradient-to-b from-coffee-400 to-coffee-600",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_8px_20px_-8px_rgba(190,112,64,0.7)]",
                "hover:from-coffee-300 hover:to-coffee-500"
              )
        )}
      >
        <ShoppingCart size={15} strokeWidth={1.75} />
      </motion.button>
    </motion.div>
  );
}