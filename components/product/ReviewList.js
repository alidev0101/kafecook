"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { User, CheckCircle } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import Skeleton from "@/components/ui/Skeleton";
import { timeAgo } from "@/lib/utils";

export default function ReviewList({ productId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => axios.get(`/api/reviews?productId=${productId}`).then((r) => r.data.data),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-border rounded-2xl space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
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

  if (!data?.length) {
    return (
      <p className="text-center py-8 text-muted-foreground text-sm">
        هنوز نظری ثبت نشده. اولین نفر باشید!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground">{data.length} نظر تأیید‌شده</h3>
      {data.map((review) => (
        <div key={review._id} className="p-5 border border-border rounded-2xl hover:border-coffee-200 dark:hover:border-coffee-800 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {review.user?.avatar
                  ? <Image src={review.user.avatar} alt={review.user.name} width={40} height={40} className="object-cover" />
                  : <User size={17} className="text-coffee-500" />
                }
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{review.user?.name}</p>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400 text-xs">
                      <CheckCircle size={11} /> خرید تأیید‌شده
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</p>
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.title && <p className="font-semibold text-foreground text-sm mb-1">{review.title}</p>}
          <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
        </div>
      ))}
    </div>
  );
}
