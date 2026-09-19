"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice, calcDiscount, formatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Badge from "@/components/ui/Badge";

export default function ProductCard({ product, className }) {
  const { addItem, items } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const image = product.images?.find((i) => i.isPrimary) || product.images?.[0];
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price ?? product.basePrice;
  const comparePrice = firstVariant?.comparePrice ?? product.baseComparePrice;
  const discount = calcDiscount(comparePrice, price);

  const inCart = items.some(
    (i) => i.productId === product._id
  );
  const wishlisted = isWishlisted(product._id);
  const isOutOfStock =
    product.variants?.length > 0 &&
    product.variants.every((v) => v.stock === 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product._id,
      variantId: firstVariant?._id,
      price,
      comparePrice,
      productSnapshot: {
        name: product.name,
        image: image?.url,
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
    toggle(product._id);
    toast.success(wishlisted ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
  };

  return (
    <Link href={`/products/${product.slug}`} className={cn("card-product group block", className)}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-50">
        {image?.url ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            ☕
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="discount">-{formatNumber(discount)}٪</Badge>
          )}
          {product.isNew && !discount && (
            <Badge variant="new">جدید</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outOfStock">ناموجود</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="افزودن به علاقه‌مندی‌ها"
        >
          <Heart
            size={15}
            className={cn(
              "transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        {product.brand && (
          <p className="text-xs text-coffee-500 font-medium mb-1 truncate">
            {product.brand.name}
          </p>
        )}

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1.5 leading-relaxed">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewsCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500">
              {product.averageRating?.toFixed(1)}
              <span className="text-gray-400 mr-1">({formatNumber(product.reviewsCount)})</span>
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div>
            {comparePrice > price && (
              <p className="text-xs text-gray-400 line-through mb-0.5">
                {formatPrice(comparePrice)}
              </p>
            )}
            <p className={cn("text-sm font-bold", isOutOfStock ? "text-gray-400" : "text-coffee-700")}>
              {isOutOfStock ? "ناموجود" : formatPrice(price)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
              isOutOfStock
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : inCart
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-coffee-600 text-white hover:bg-coffee-700 shadow-warm hover:shadow-warm-lg active:scale-95"
            )}
            aria-label="افزودن به سبد"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
