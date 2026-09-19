"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { User, CheckCircle } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { timeAgo } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

export default function ReviewList({ productId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () =>
      axios.get(`/api/reviews?productId=${productId}`).then((r) => r.data.data),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-2xl space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        هنوز نظری ثبت نشده است. اولین نفر باشید!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800">{data.length} نظر تأیید شده</h3>
      {data.map((review) => (
        <div key={review._id} className="p-5 border border-gray-100 rounded-2xl hover:border-coffee-200 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coffee-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {review.user?.avatar ? (
                  <Image src={review.user.avatar} alt={review.user.name} width={40} height={40} className="object-cover" />
                ) : (
                  <User size={18} className="text-coffee-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-800">{review.user?.name}</p>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle size={12} />
                      <span>خرید تأیید شده</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400">{timeAgo(review.createdAt)}</p>
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>

          {review.title && (
            <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
        </div>
      ))}
    </div>
  );
}
