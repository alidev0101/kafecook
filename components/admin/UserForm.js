"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function UserForm({ user, onSuccess, onCancel }) {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "USER",
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        role: user.role || "USER",
        isActive: user.isActive ?? true,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axios.put(`/api/users/${user._id}`, data).then((r) => r.data)
        : axios.post("/api/users", data).then((r) => r.data),
    onSuccess: () => {
      toast.success(isEdit ? "کاربر ویرایش شد" : "کاربر ایجاد شد");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ذخیره کاربر");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
      role: data.role,
      isActive: data.isActive,
    };

    if (data.password?.trim()) {
      payload.password = data.password.trim();
    }

    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="نام و نام خانوادگی"
          placeholder="مثلاً: علی احمدی"
          required
          {...register("name", {
            required: "نام الزامی است",
            minLength: {
              value: 2,
              message: "نام باید حداقل ۲ کاراکتر باشد",
            },
            maxLength: {
              value: 50,
              message: "نام نباید بیشتر از ۵۰ کاراکتر باشد",
            },
          })}
          error={errors.name?.message}
        />

        <Input
          label="ایمیل"
          type="email"
          placeholder="example@gmail.com"
          required
          {...register("email", {
            required: "ایمیل الزامی است",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "ایمیل معتبر نیست",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="شماره موبایل"
          placeholder="09123456789"
          dir="ltr"
          {...register("phone", {
            pattern: {
              value: /^09[0-9]{9}$/,
              message: "شماره موبایل معتبر نیست",
            },
          })}
          error={errors.phone?.message}
        />

        <Input
          label={isEdit ? "رمز عبور جدید" : "رمز عبور"}
          type="password"
          placeholder={isEdit ? "در صورت نیاز وارد کنید" : "حداقل ۶ کاراکتر"}
          required={!isEdit}
          {...register("password", {
            required: !isEdit ? "رمز عبور الزامی است" : false,
            minLength: {
              value: 6,
              message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
            },
          })}
          error={errors.password?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            نقش
          </label>
          <select
            className="input-custom h-11"
            {...register("role", { required: "نقش الزامی است" })}
          >
            <option value="USER">کاربر</option>
            <option value="ADMIN">ادمین</option>
          </select>
          {errors.role && (
            <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            وضعیت
          </label>
          <label className="flex items-center gap-2 h-11 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-coffee-600 rounded"
              {...register("isActive")}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              کاربر فعال باشد
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-3 border-t border-border">
        <Button variant="secondary" type="button" onClick={onCancel}>
          انصراف
        </Button>

        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? "ذخیره تغییرات" : "ایجاد کاربر"}
        </Button>
      </div>
    </form>
  );
}