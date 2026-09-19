"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { reviewSchema } from "@/validations/product";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function ReviewForm({ productId }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      axios.post("/api/reviews", { ...data, productId, rating }),
    onSuccess: () => {
      toast.success("نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود");
      reset();
      setRating(5);
      queryClient.invalidateQueries(["reviews", productId]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ثبت نظر");
    },
  });

  if (!session) {
    return (
      <div className="bg-cream-50 rounded-2xl p-6 text-center">
        <p className="text-gray-600 mb-3">برای ثبت نظر ابتدا وارد حساب کاربری خود شوید</p>
        <Link href="/login" className="text-coffee-600 font-medium hover:underline">
          ورود به حساب
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 rounded-2xl p-6">
      <h3 className="font-bold text-gray-800 mb-5">ثبت نظر</h3>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">امتیاز شما:</label>
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onChange={setRating}
          />
        </div>

        <Input
          label="عنوان نظر"
          placeholder="مثلاً: عالی بود!"
          {...register("title")}
          error={errors.title?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">متن نظر *</label>
          <textarea
            placeholder="تجربه خود را با دیگران به اشتراک بگذارید..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent resize-none bg-white"
            {...register("body")}
          />
          {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
        </div>

        <Button
          type="submit"
          loading={mutation.isPending}
          className="w-full"
        >
          ثبت نظر
        </Button>
      </form>
    </div>
  );
}
