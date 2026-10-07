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
  AlertTriangle,
  Coffee,
  Flame,
  MapPin,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatPrice, calcDiscount, formatNumber,
  ROAST_LABELS, GRIND_LABELS, cn
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
  { id: "description", label: "توضیحات" },
  { id: "specifications", label: "مشخصات" },
  { id: "brewing", label: "روش دم‌آوری" },
  { id: "reviews", label: null }, // dynamic label
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem, items } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

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
          <div className="glass rounded-[2rem] p-2.5">
            <div className="aspect-square bg-coffee-500/5 dark:bg-white/[0.04] rounded-3xl animate-pulse" />
          </div>
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

  const price = currentVariant?.price ?? product.basePrice ?? 0;
  const comparePrice = currentVariant?.comparePrice ?? product.baseComparePrice ?? null;
  const discount = calcDiscount(comparePrice, price);
  const stock = currentVariant?.stock ?? 0;
  const isOutOfStock = stock === 0;
  const wishlisted = isWishlisted(product._id?.toString());

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
      <div className="container-custom pb-6 pt-20">
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
            <div className="glass rounded-[2rem] p-2.5 mb-3 group">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-coffee-500/5 dark:bg-white/[0.04]">
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
                      sizes="(max-width:640px) 90vw,45vw"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </motion.div>
                </AnimatePresence>
                {/* soft inner sheen */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/10" />

                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="discount" className="text-sm px-3 py-1 shadow-[0_8px_18px_-6px_rgba(239,68,68,0.7)]">-{formatNumber(discount)}٪</Badge>
                  </div>
                )}

                {/* Nav arrows */}
                {(product.images?.length ?? 0) > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((p) => p > 0 ? p - 1 : product.images.length - 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/70 dark:border-white/15 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_6px_16px_-6px_rgba(0,0,0,0.35)] hover:bg-white/90 dark:hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => p < product.images.length - 1 ? p + 1 : 0)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/70 dark:border-white/15 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_6px_16px_-6px_rgba(0,0,0,0.35)] hover:bg-white/90 dark:hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {(product.images?.length ?? 0) > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setActiveImage(i)}
                    className={`glass flex-shrink-0 w-16 h-16 rounded-2xl p-1 overflow-hidden transition-all duration-200 ${activeImage === i
                      ? "!border-coffee-400/60 shadow-[0_8px_20px_-8px_rgba(190,112,64,0.6)]"
                      : "hover:border-coffee-300/40"
                      }`}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-coffee-500/5 dark:bg-white/[0.04]">
                      <Image
                        src={img.url}
                        alt={`تصویر ${i + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                      />
                    </div>
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
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-coffee-600 dark:text-coffee-400">
                <Coffee size={15} strokeWidth={1.8} />
                <span>{product.brand.name}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="mb-3 font-morabba text-2xl font-black leading-snug text-foreground md:text-3xl">
              {product.name}
            </h1>

            {/* Rating + Sales */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <StarRating rating={product.averageRating || 0} showValue size="md" />
                <span className="text-xs text-muted-foreground">
                  ({formatNumber(product.reviewsCount || 0)} نظر)
                </span>
              </div>

              {product.soldCount > 0 && (
                <div className="flex items-center gap-1.5 border-r border-border pr-3 text-xs text-muted-foreground">
                  <ShoppingBag size={14} />
                  <span>{formatNumber(product.soldCount)} فروش</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="mb-6 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3.5 dark:bg-white/[0.025]">
                <p className="text-sm leading-7 text-muted-foreground">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* Coffee Attributes */}
            {product.coffeeAttributes && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-coffee-100 text-coffee-700 dark:bg-coffee-900/40 dark:text-coffee-300">
                    <Coffee size={14} />
                  </div>

                  <span className="text-sm font-bold text-foreground">
                    مشخصات قهوه
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      key: "origin",
                      label: "مبدأ",
                      val: product.coffeeAttributes.origin,
                      icon: MapPin,
                    },
                    {
                      key: "roastLevel",
                      label: "رست",
                      val: ROAST_LABELS[product.coffeeAttributes.roastLevel],
                      icon: Flame,
                    },
                    {
                      key: "variety",
                      label: "واریته",
                      val: product.coffeeAttributes.variety,
                      icon: Sprout,
                    },
                    {
                      key: "process",
                      label: "فرآیند",
                      val: product.coffeeAttributes.process,
                      icon: RefreshCw,
                    },
                  ]
                    .filter((a) => a.val)
                    .map(({ key, label, val, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-3 py-2.5 transition-colors duration-200 hover:border-coffee-300/60 dark:hover:border-coffee-700/60"
                      >
                        <Icon
                          size={15}
                          strokeWidth={1.8}
                          className="shrink-0 text-coffee-600 dark:text-coffee-400"
                        />

                        <div className="min-w-0">
                          <span className="block text-[10px] text-muted-foreground">
                            {label}
                          </span>

                          <span className="block truncate text-xs font-semibold text-foreground">
                            {val}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">انتخاب وزن و آسیاب</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      گزینه موردنظر خود را انتخاب کنید
                    </p>
                  </div>

                  <Scale size={16} className="text-coffee-500 dark:text-coffee-400" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const selected =
                      selectedVariantId === v._id ||
                      (!selectedVariantId && v._id === product.variants[0]._id);

                    return (
                      <motion.button
                        key={v._id}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedVariantId(v._id)}
                        disabled={v.stock === 0}
                        className={cn(
                          "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                          selected
                            ? "border-coffee-500 bg-coffee-600 text-white shadow-md shadow-coffee-900/15 dark:border-coffee-400 dark:bg-coffee-500"
                            : "border-border/70 bg-card text-foreground hover:border-coffee-400/60 hover:bg-coffee-50/60 dark:hover:bg-coffee-950/30",
                          v.stock === 0 &&
                          "cursor-not-allowed opacity-40 line-through"
                        )}
                      >
                        {v.weightLabel}

                        {v.grindLabel && (
                          <span className="mr-1 text-xs opacity-70">
                            — {v.grindLabel}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-coffee-200/60 bg-coffee-50/50 p-4 dark:border-coffee-800/50 dark:bg-coffee-950/20">
              <div className="flex flex-1 items-end gap-2">
                {comparePrice > price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}

                <span
                  className={cn(
                    "text-2xl font-black",
                    isOutOfStock
                      ? "text-muted-foreground"
                      : "text-coffee-700 dark:text-coffee-300"
                  )}
                >
                  {isOutOfStock ? "ناموجود" : formatPrice(price)}
                </span>
              </div>

              {discount > 0 && <Badge variant="discount">-{formatNumber(discount)}٪</Badge>}
            </div>

            {/* Stock */}
            {!isOutOfStock && stock <= 10 && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-orange-200/70 bg-orange-50/70 px-3 py-2.5 text-xs font-medium text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-orange-300">
                <AlertTriangle size={15} />
                <span>
                  فقط {formatNumber(stock)} عدد باقی مانده است
                </span>
              </div>
            )}

            {/* Cart Actions */}
            <div className="mb-6 flex gap-2.5">
              {!isOutOfStock && (
                <div className="flex h-12 items-center rounded-2xl border border-border/70 bg-card p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-9 text-center text-sm font-bold text-foreground">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="flex h-10 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="h-12 flex-1 !rounded-2xl !bg-gradient-to-r !from-coffee-600 !to-coffee-500 !shadow-lg !shadow-coffee-900/15 hover:!from-coffee-700 hover:!to-coffee-600 dark:!from-coffee-500 dark:!to-coffee-400 dark:!shadow-coffee-950/30"
              >
                <ShoppingCart size={17} />
                {isOutOfStock ? "ناموجود" : "افزودن به سبد خرید"}
              </Button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  toggle(product._id?.toString());
                  toast.success(
                    wishlisted
                      ? "از علاقه‌مندی‌ها حذف شد"
                      : "به علاقه‌مندی‌ها اضافه شد"
                  );
                }}
                aria-label={
                  wishlisted
                    ? "حذف از علاقه‌مندی‌ها"
                    : "افزودن به علاقه‌مندی‌ها"
                }
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200",
                  wishlisted
                    ? "border-red-300 bg-red-500/10 text-red-500 dark:border-red-800/60 dark:bg-red-950/30"
                    : "border-border/70 bg-card text-muted-foreground hover:border-coffee-400/60 hover:bg-coffee-50 hover:text-coffee-600 dark:hover:bg-coffee-950/30 dark:hover:text-coffee-300"
                )}
              >
                <Heart size={19} className={wishlisted ? "fill-current" : ""} />
              </motion.button>
            </div>

            {/* Trust */}
            <div className="border-t border-border/60 pt-5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    icon: Truck,
                    title: "ارسال سریع",
                    desc: "تحویل مطمئن",
                  },
                  {
                    icon: ShieldCheck,
                    title: "ضمانت اصالت",
                    desc: "تضمین کیفیت",
                  },
                  {
                    icon: RefreshCw,
                    title: "۷ روز مرجوعی",
                    desc: "خرید مطمئن",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center rounded-xl border border-border/50 bg-muted/30 px-2 py-3 text-center dark:bg-white/[0.02]"
                  >
                    <Icon
                      size={17}
                      className="mb-1.5 text-coffee-600 dark:text-coffee-400"
                    />

                    <span className="text-[11px] font-semibold text-foreground">
                      {title}
                    </span>

                    <span className="mt-0.5 text-[9px] text-muted-foreground">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Tabs ── */}
        <div className="mt-12">
          <div className="glass inline-flex gap-1 rounded-2xl p-1.5 max-w-full overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 sm:px-5 py-2.5 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-gradient-to-b from-coffee-400 to-coffee-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_6px_14px_-6px_rgba(190,112,64,0.7)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/[0.05]"
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
          <div className="mt-6 pt-8 border-t border-black/[0.06] dark:border-white/10">
            <h2 className="font-morabba text-xl font-black text-foreground mb-6">
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
    <div className="glass flex items-center gap-4 p-3 rounded-2xl">
      <span className="text-sm text-muted-foreground w-24 flex-shrink-0">{label}</span>
      {isBar ? (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-2 bg-coffee-900/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(value / 5) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full bg-gradient-to-l from-coffee-400 to-coffee-600 rounded-full"
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
