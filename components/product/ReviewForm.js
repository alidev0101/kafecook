"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { reviewSchema } from "@/validations/product";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ReviewForm({ productId }) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      body: "",
      rating: 5,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => axios.post("/api/reviews", { ...data, productId }),

    onSuccess: () => {
      toast.success("نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود");
      reset();
      setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ثبت نظر");
    },
  });

  if (!session) {
    return (
      <div className="bg-muted/40 dark:bg-muted/20 rounded-2xl p-6 text-center border border-border">
        <p className="text-muted-foreground mb-3 text-sm">
          برای ثبت نظر ابتدا وارد شوید
        </p>
        <Link
          href="/login"
          className="text-coffee-600 dark:text-coffee-400 font-medium hover:underline text-sm"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 dark:bg-muted/10 rounded-2xl p-6 border border-border">
      <h3 className="font-bold text-foreground mb-5">ثبت نظر</h3>

      <form
        onSubmit={handleSubmit(
          (data) => {
            mutation.mutate({ ...data, rating });
          }
        )}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            امتیاز شما:
          </label>
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onChange={(value) => {
              setRating(value);
              setValue("rating", value, { shouldValidate: true });
            }}
          />
        </div>

        <Input
          label="عنوان نظر"
          placeholder="مثلاً: عالی بود!"
          {...register("title")}
          error={errors.title?.message}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            متن نظر *
          </label>
          <textarea
            rows={4}
            placeholder="تجربه خود را بنویسید..."
            className="input-custom resize-none"
            {...register("body")}
          />
          {errors.body && (
            <p className="text-xs text-destructive mt-1">
              {errors.body.message}
            </p>
          )}
        </div>

        <Button type="submit" loading={mutation.isPending} className="w-full">
          ثبت نظر
        </Button>
      </form>
    </div>
  );
}
