"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, Star, Truck, Shield, RefreshCw,
  ChevronRight, ChevronLeft, Minus, Plus, Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatPrice, calcDiscount, formatNumber,
  ROAST_LABELS, GRIND_LABELS,cn
} from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewList from "@/components/product/ReviewList";
import ProductGrid from "@/components/product/ProductGrid";
import { DEFAULT_IMG } from "@/lib/constants";

const TABS = [
  { id: "description",   label: "توضیحات"       },
  { id: "specifications", label: "مشخصات"        },
  { id: "brewing",       label: "روش دم‌آوری"   },
  { id: "reviews",       label: null            }, // dynamic label
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem, items } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity]                    = useState(1);
  const [activeImage, setActiveImage]              = useState(0);
  const [activeTab, setActiveTab]                  = useState("description");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => axios.get(`/api/products/${slug}`).then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ["related", product?.category?._id],
    queryFn: () =>
      axios.get(`/api/products?category=${product.category._id}&limit=4`).then((r) => r.data.data),
    enabled: !!product?.category?._id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="container-custom py-8 space-y-6">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-muted rounded-3xl animate-pulse" />
          <div className="space-y-4">
            {[80, 40, 100, 60, 100].map((w, i) => (
              <div key={i} className={`h-5 bg-muted rounded-xl animate-pulse w-${w ? "[" + w + "%]" : "full"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentVariant = selectedVariantId
    ? product.variants?.find((v) => v._id === selectedVariantId)
    : product.variants?.[0];

  const price        = currentVariant?.price        ?? product.basePrice        ?? 0;
  const comparePrice = currentVariant?.comparePrice ?? product.baseComparePrice ?? null;
  const discount     = calcDiscount(comparePrice, price);
  const stock        = currentVariant?.stock        ?? 0;
  const isOutOfStock = stock === 0;
  const wishlisted   = isWishlisted(product._id?.toString());

  const tabs = TABS.map((t) =>
    t.id === "reviews"
      ? { ...t, label: `نظرات (${formatNumber(product.reviewsCount || 0)})` }
      : t
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product._id?.toString(),
      variantId: currentVariant?._id?.toString(),
      price,
      comparePrice,
      quantity,
      productSnapshot: {
        name: product.name,
        image: product.images?.[0]?.url || null,
        slug: product.slug,
        weightLabel: currentVariant?.weightLabel,
        grindLabel: currentVariant?.grindLabel,
      },
    });
    toast.success("محصول به سبد خرید اضافه شد");
  };

  return (
    <div className="bg-background">
      <div className="container-custom py-6">
        <Breadcrumb
          items={[
            { label: "محصولات", href: "/products" },
            { label: product.category?.name, href: `/categories/${product.category?.slug}` },
            { label: product.name },
          ]}
        />

        {/* ── Product Main ── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-4">
          {/* Gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/30 dark:bg-muted/10 mb-3 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images?.[activeImage]?.url || DEFAULT_IMG}
                    alt={product.images?.[activeImage]?.alt || product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width:1024px) 100vw,50vw"
                    onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-4 right-4">
                  <Badge variant="discount" className="text-sm px-3 py-1">-{formatNumber(discount)}٪</Badge>
                </div>
              )}

              {/* Nav arrows */}
              {(product.images?.length ?? 0) > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => p > 0 ? p - 1 : product.images.length - 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => p < product.images.length - 1 ? p + 1 : 0)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {(product.images?.length ?? 0) > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-coffee-500" : "border-transparent hover:border-border"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`تصویر ${i + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Brand */}
            {product.brand?.name && (
              <p className="text-sm text-coffee-500 dark:text-coffee-400 font-medium mb-1">
                {product.brand.name}
              </p>
            )}

            <h1
              className="text-2xl md:text-3xl font-black text-foreground mb-3 leading-snug"
              style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.averageRating || 0} showValue size="md" />
              <span className="text-sm text-muted-foreground">
                ({formatNumber(product.reviewsCount || 0)} نظر)
              </span>
              {product.soldCount > 0 && (
                <span className="text-xs text-muted-foreground border-r border-border pr-3 mr-1">
                  {formatNumber(product.soldCount)} فروش
                </span>
              )}
            </div>

            {/* Short desc */}
            {product.shortDescription && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {product.shortDescription}
              </p>
            )}

            {/* Coffee quick attrs */}
            {product.coffeeAttributes && (
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { key: "origin",     label: "مبدأ",   val: product.coffeeAttributes.origin },
                  { key: "roastLevel", label: "رست",    val: ROAST_LABELS[product.coffeeAttributes.roastLevel] },
                  { key: "variety",    label: "واریته",  val: product.coffeeAttributes.variety },
                  { key: "process",    label: "فرآیند",  val: product.coffeeAttributes.process },
                ].filter((a) => a.val).map(({ key, label, val }) => (
                  <div key={key} className="bg-muted/50 dark:bg-muted/20 rounded-xl px-3 py-2 text-xs">
                    <span className="text-muted-foreground">{label}: </span>
                    <span className="font-medium text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-foreground mb-2">وزن / آسیاب:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <motion.button
                      key={v._id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedVariantId(v._id)}
                      disabled={v.stock === 0}
                      className={cn(
                        "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                        (selectedVariantId === v._id || (!selectedVariantId && v._id === product.variants[0]._id))
                          ? "border-coffee-500 bg-coffee-50 dark:bg-coffee-900/20 text-coffee-700 dark:text-coffee-300"
                          : "border-border text-foreground hover:border-coffee-300",
                        v.stock === 0 && "opacity-40 cursor-not-allowed line-through"
                      )}
                    >
                      {v.weightLabel}
                      {v.grindLabel && <span className="text-xs opacity-70 mr-1">— {v.grindLabel}</span>}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-5">
              {comparePrice > price && (
                <span className="text-base text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
              )}
              <span className={`text-2xl font-black ${isOutOfStock ? "text-muted-foreground" : "text-coffee-700 dark:text-coffee-400"}`}>
                {isOutOfStock ? "ناموجود" : formatPrice(price)}
              </span>
              {discount > 0 && <Badge variant="discount">-{formatNumber(discount)}٪</Badge>}
            </div>

            {/* Low stock warning */}
            {!isOutOfStock && stock <= 10 && (
              <p className="text-xs text-orange-500 dark:text-orange-400 mb-3 font-medium">
                ⚠ فقط {formatNumber(stock)} عدد باقی مانده
              </p>
            )}

            {/* Add to cart */}
            <div className="flex gap-3 mb-5">
              {!isOutOfStock && (
                <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg hover:bg-card flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="w-9 h-9 rounded-lg hover:bg-card flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart size={17} />
                {isOutOfStock ? "ناموجود" : "افزودن به سبد"}
              </Button>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => {
                  toggle(product._id?.toString());
                  toast.success(wishlisted ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
                }}
                className={cn(
                  "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
                  wishlisted
                    ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500"
                    : "border-border text-muted-foreground hover:border-coffee-300 hover:text-coffee-600"
                )}
              >
                <Heart size={19} className={wishlisted ? "fill-red-500" : ""} />
              </motion.button>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border pt-4">
              <span className="flex items-center gap-1.5"><Truck size={13} className="text-blue-500" /> ارسال سریع</span>
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-green-500" /> ضمانت اصالت</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={13} className="text-purple-500" /> ۷ روز مرجوعی</span>
            </div>
          </motion.div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all duration-200",
                  activeTab === tab.id
                    ? "border-coffee-600 dark:border-coffee-400 text-coffee-700 dark:text-coffee-300"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed">
                {product.description || <p className="text-muted-foreground">توضیحاتی ثبت نشده است.</p>}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid sm:grid-cols-2 gap-3">
                {product.coffeeAttributes?.acidity && (
                  <AttrRow label="اسیدیته" value={product.coffeeAttributes.acidity} isBar />
                )}
                {product.coffeeAttributes?.body && (
                  <AttrRow label="بادی" value={product.coffeeAttributes.body} isBar />
                )}
                {product.coffeeAttributes?.bitterness && (
                  <AttrRow label="تلخی" value={product.coffeeAttributes.bitterness} isBar />
                )}
                {product.coffeeAttributes?.sweetness && (
                  <AttrRow label="شیرینی" value={product.coffeeAttributes.sweetness} isBar />
                )}
                {product.coffeeAttributes?.aroma && (
                  <AttrRow label="عطر" value={product.coffeeAttributes.aroma} />
                )}
                {product.coffeeAttributes?.flavorNotes?.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">نت‌های طعمی:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.coffeeAttributes.flavorNotes.map((n) => (
                        <Badge key={n} variant="primary">{n}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {product.specifications?.map((spec) => (
                  <AttrRow key={spec.key} label={spec.key} value={spec.value} />
                ))}
                {!product.coffeeAttributes && !product.specifications?.length && (
                  <p className="text-muted-foreground text-sm sm:col-span-2">مشخصاتی ثبت نشده است.</p>
                )}
              </div>
            )}

            {activeTab === "brewing" && (
              <div className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {product.brewingGuide || <p>راهنمای دم‌آوری ثبت نشده است.</p>}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                <ReviewForm productId={product._id?.toString()} />
                <ReviewList productId={product._id?.toString()} />
              </div>
            )}
          </div>
        </div>

        {/* ── Related ── */}
        {related?.filter((p) => p._id !== product._id).length > 0 && (
          <div className="mt-6 pt-8 border-t border-border">
            <h2 className="text-xl font-black text-foreground mb-6" style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>
              محصولات مشابه
            </h2>
            <ProductGrid products={related.filter((p) => p._id !== product._id).slice(0, 4)} />
          </div>
        )}
      </div>
    </div>
  );
}

function AttrRow({ label, value, isBar }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-muted/40 dark:bg-muted/20 rounded-xl">
      <span className="text-sm text-muted-foreground w-24 flex-shrink-0">{label}</span>
      {isBar ? (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / 5) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full bg-coffee-500 dark:bg-coffee-400 rounded-full"
            />
          </div>
          <span className="text-xs font-medium text-foreground w-8 text-left">{value}/5</span>
        </div>
      ) : (
        <span className="text-sm font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}
