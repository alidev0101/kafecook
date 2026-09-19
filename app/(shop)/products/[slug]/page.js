"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {
  ShoppingCart, Heart, Star, Truck, Shield, RefreshCw,
  ChevronRight, ChevronLeft, Minus, Plus, Share2,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice, calcDiscount, formatNumber, ROAST_LABELS, GRIND_LABELS } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import ProductGrid from "@/components/product/ProductGrid";
import Skeleton from "@/components/ui/Skeleton";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewList from "@/components/product/ReviewList";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem, items } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => axios.get(`/api/products/${slug}`).then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["related-products", product?.category?._id],
    queryFn: () =>
      axios
        .get(`/api/products?category=${product.category._id}&limit=4`)
        .then((r) => r.data.data),
    enabled: !!product?.category?._id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentVariant = selectedVariant
    ? product.variants.find((v) => v._id === selectedVariant)
    : product.variants?.[0];

  const price = currentVariant?.price ?? product.basePrice;
  const comparePrice = currentVariant?.comparePrice ?? product.baseComparePrice;
  const discount = calcDiscount(comparePrice, price);
  const stock = currentVariant?.stock ?? 0;
  const isOutOfStock = stock === 0;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product._id,
      variantId: currentVariant?._id,
      price,
      comparePrice,
      quantity,
      productSnapshot: {
        name: product.name,
        image: product.images?.[0]?.url,
        slug: product.slug,
        weightLabel: currentVariant?.weightLabel,
        grindLabel: currentVariant?.grindLabel,
      },
    });
    toast.success("محصول به سبد خرید اضافه شد");
  };

  const tabs = [
    { id: "description", label: "توضیحات" },
    { id: "specifications", label: "مشخصات" },
    { id: "brewing", label: "روش دم‌آوری" },
    { id: "reviews", label: `نظرات (${formatNumber(product.reviewsCount || 0)})` },
  ];

  return (
    <div className="bg-background">
      <div className="container-custom py-6">
        <Breadcrumb
          items={[
            { label: "محصولات", href: "/products" },
            { label: product.category?.name || "", href: `/categories/${product.category?.slug}` },
            { label: product.name },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-4">
          {/* Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-50 mb-3">
              {product.images?.[activeImage]?.url ? (
                <Image
                  src={product.images[activeImage].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">☕</div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4">
                  <Badge variant="discount" className="text-sm px-3 py-1">-{formatNumber(discount)}٪</Badge>
                </div>
              )}
              {/* Nav arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p > 0 ? p - 1 : product.images.length - 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p < product.images.length - 1 ? p + 1 : 0))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-coffee-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img.url} alt={`تصویر ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-coffee-500 font-medium mb-1">{product.brand.name}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.averageRating || 0} showValue size="md" />
              <span className="text-sm text-gray-400">
                ({formatNumber(product.reviewsCount || 0)} نظر)
              </span>
              {product.soldCount > 0 && (
                <span className="text-xs text-gray-400 border-r border-gray-200 pr-3 mr-3">
                  {formatNumber(product.soldCount)} فروش
                </span>
              )}
            </div>

            {/* Short desc */}
            {product.shortDescription && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {product.shortDescription}
              </p>
            )}

            {/* Coffee attributes quick */}
            {product.coffeeAttributes && (
              <div className="grid grid-cols-2 gap-2 mb-5">
                {product.coffeeAttributes.origin && (
                  <div className="bg-cream-50 rounded-xl px-3 py-2 text-xs">
                    <span className="text-gray-400">مبدأ: </span>
                    <span className="font-medium text-gray-700">{product.coffeeAttributes.origin}</span>
                  </div>
                )}
                {product.coffeeAttributes.roastLevel && (
                  <div className="bg-cream-50 rounded-xl px-3 py-2 text-xs">
                    <span className="text-gray-400">رست: </span>
                    <span className="font-medium text-gray-700">
                      {ROAST_LABELS[product.coffeeAttributes.roastLevel]}
                    </span>
                  </div>
                )}
                {product.coffeeAttributes.variety && (
                  <div className="bg-cream-50 rounded-xl px-3 py-2 text-xs">
                    <span className="text-gray-400">واریته: </span>
                    <span className="font-medium text-gray-700">{product.coffeeAttributes.variety}</span>
                  </div>
                )}
                {product.coffeeAttributes.process && (
                  <div className="bg-cream-50 rounded-xl px-3 py-2 text-xs">
                    <span className="text-gray-400">فرآیند: </span>
                    <span className="font-medium text-gray-700">{product.coffeeAttributes.process}</span>
                  </div>
                )}
              </div>
            )}

            {/* Variants — Weight */}
            {product.variants?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">وزن:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v._id)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        (selectedVariant === v._id) ||
                        (!selectedVariant && v._id === product.variants[0]._id)
                          ? "border-coffee-600 bg-coffee-50 text-coffee-700"
                          : "border-gray-200 text-gray-600 hover:border-coffee-300"
                      } ${v.stock === 0 ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                      disabled={v.stock === 0}
                    >
                      {v.weightLabel}
                      {v.grindLabel && ` — ${v.grindLabel}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              {comparePrice > price && (
                <span className="text-base text-gray-400 line-through">{formatPrice(comparePrice)}</span>
              )}
              <span className={`text-2xl font-black ${isOutOfStock ? "text-gray-400" : "text-coffee-700"}`}>
                {isOutOfStock ? "ناموجود" : formatPrice(price)}
              </span>
              {discount > 0 && <Badge variant="discount">-{formatNumber(discount)}٪</Badge>}
            </div>

            {/* Stock */}
            {!isOutOfStock && stock <= 10 && (
              <p className="text-xs text-orange-500 mb-3 font-medium">
                ⚠️ فقط {formatNumber(stock)} عدد باقی مانده
              </p>
            )}

            {/* Quantity + Actions */}
            <div className="flex gap-3 mb-6">
              {/* Quantity */}
              {!isOutOfStock && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg hover:bg-white flex items-center justify-center transition-colors text-gray-500"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="w-9 h-9 rounded-lg hover:bg-white flex items-center justify-center transition-colors text-gray-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? "ناموجود" : "افزودن به سبد"}
              </Button>

              <button
                onClick={() => { toggle(product._id); toast.success(wishlisted ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد"); }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                  wishlisted ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-coffee-300 hover:text-coffee-600"
                }`}
                aria-label="علاقه‌مندی"
              >
                <Heart size={20} className={wishlisted ? "fill-red-500" : ""} />
              </button>
            </div>

            {/* Trust icons */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-100 pt-5">
              <span className="flex items-center gap-1.5"><Truck size={14} className="text-blue-500" /> ارسال سریع</span>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-green-500" /> ضمانت اصالت</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={14} className="text-purple-500" /> ۷ روز مرجوعی</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? "border-coffee-600 text-coffee-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {product.description || <p className="text-gray-400">توضیحاتی ثبت نشده است.</p>}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Coffee attributes */}
                {product.coffeeAttributes?.acidity && (
                  <AttributeRow label="اسیدیته" value={product.coffeeAttributes.acidity} isBar />
                )}
                {product.coffeeAttributes?.body && (
                  <AttributeRow label="بادی (غلظت)" value={product.coffeeAttributes.body} isBar />
                )}
                {product.coffeeAttributes?.bitterness && (
                  <AttributeRow label="تلخی" value={product.coffeeAttributes.bitterness} isBar />
                )}
                {product.coffeeAttributes?.sweetness && (
                  <AttributeRow label="شیرینی" value={product.coffeeAttributes.sweetness} isBar />
                )}
                {product.coffeeAttributes?.aroma && (
                  <AttributeRow label="عطر" value={product.coffeeAttributes.aroma} />
                )}
                {product.coffeeAttributes?.flavorNotes?.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">نت‌های طعمی:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.coffeeAttributes.flavorNotes.map((n) => (
                        <Badge key={n} variant="primary">{n}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {/* Custom specs */}
                {product.specifications?.map((spec) => (
                  <AttributeRow key={spec.key} label={spec.key} value={spec.value} />
                ))}
              </div>
            )}

            {activeTab === "brewing" && (
              <div className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                {product.brewingGuide || <p className="text-gray-400">راهنمای دم‌آوری ثبت نشده است.</p>}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                <ReviewForm productId={product._id} />
                <ReviewList productId={product._id} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedData?.length > 0 && (
          <div className="mt-6 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">محصولات مشابه</h2>
            <ProductGrid products={relatedData?.filter((p) => p._id !== product._id).slice(0, 4)} />
          </div>
        )}
      </div>
    </div>
  );
}

function AttributeRow({ label, value, isBar }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-cream-50 rounded-xl">
      <span className="text-sm text-gray-500 w-28 flex-shrink-0">{label}</span>
      {isBar ? (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-coffee-400 rounded-full transition-all"
              style={{ width: `${(value / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 w-5">{value}/5</span>
        </div>
      ) : (
        <span className="text-sm font-medium text-gray-800">{value}</span>
      )}
    </div>
  );
}
