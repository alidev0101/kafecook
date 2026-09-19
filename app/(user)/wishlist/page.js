"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Heart } from "lucide-react";
import UserSidebar from "@/components/shared/UserSidebar";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useWishlistStore } from "@/store/wishlistStore";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { formatNumber } from "@/lib/utils";

export default function WishlistPage() {
  const setFromServer = useWishlistStore((s) => s.setFromServer);

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => axios.get("/api/wishlist").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (data?.products) setFromServer(data.products);
  }, [data, setFromServer]);

  const products = data?.products?.map((p) => p.product).filter(Boolean) || [];

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "علاقه‌مندی‌ها" }]} />
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <UserSidebar />
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center gap-2 mb-6">
              <Heart size={20} className="text-coffee-500" />
              <h2 className="text-lg font-bold text-gray-800">
                علاقه‌مندی‌ها
                {data?.count > 0 && (
                  <span className="text-sm font-normal text-gray-400 mr-2">
                    ({formatNumber(data.count)} محصول)
                  </span>
                )}
              </h2>
            </div>

            {!isLoading && products.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="علاقه‌مندی خالی است"
                description="محصولاتی که دوست دارید را با قلب ذخیره کنید"
                action={{ label: "مشاهده محصولات", href: "/products" }}
              />
            ) : (
              <ProductGrid products={products} loading={isLoading} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
