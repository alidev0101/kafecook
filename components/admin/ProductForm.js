"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/admin/ImageUpload";
import { GRIND_LABELS } from "@/lib/utils";

export default function ProductForm({ product, onSuccess, onCancel }) {
  const isEdit = !!product;
  const [images, setImages] = useState(product?.images || []);

  const { data: categories } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => axios.get("/api/categories").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
  const { data: brands } = useQuery({
    queryKey: ["brands-all"],
    queryFn: () => axios.get("/api/brands").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          category: product.category?._id || product.category || "",
          brand: product.brand?._id || product.brand || "",
          variants: product.variants?.length
            ? product.variants
            : [{ weightLabel: "۲۵۰ گرم", weight: 250, price: 0, stock: 0, grindType: "whole_bean" }],
          isActive:     product.isActive !== undefined ? product.isActive : true,
          isFeatured:   product.isFeatured || false,
          isNew:        product.isNew !== undefined ? product.isNew : true,
          isBestSeller: product.isBestSeller || false,
          brewingGuide: product.brewingGuide || "",
        }
      : {
          variants: [{ weightLabel: "۲۵۰ گرم", weight: 250, price: 0, stock: 0, grindType: "whole_bean" }],
          isActive: true,
          isNew: true,
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axios.put(`/api/products/${product.slug}`, data).then((r) => r.data)
        : axios.post("/api/products", data).then((r) => r.data),
    onSuccess: () => {
      toast.success(isEdit ? "محصول ویرایش شد" : "محصول ایجاد شد");
      onSuccess?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || "خطا"),
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      images, // آرایه تصاویر آپلود‌شده
      variants: data.variants.map((v) => ({
        ...v,
        weight:       Number(v.weight)       || 250,
        price:        Number(v.price)        || 0,
        comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
        stock:        Number(v.stock)        || 0,
      })),
      brand:  data.brand || null,
    };
    mutation.mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 scrollbar-hide"
    >
      {/* ─── تصاویر ────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          تصاویر محصول
        </h3>
        <ImageUpload images={images} onChange={setImages} maxImages={6} />
      </div>

      {/* ─── اطلاعات پایه ──────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="نام محصول"
            placeholder="مثلاً: اتیوپی یرگاچف"
            required
            {...register("name", { required: "نام محصول الزامی است" })}
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            دسته‌بندی *
          </label>
          <select
            className="input-custom h-11"
            {...register("category", { required: "دسته‌بندی الزامی است" })}
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">برند</label>
          <select className="input-custom h-11" {...register("brand")}>
            <option value="">بدون برند</option>
            {brands?.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Input
            label="توضیح کوتاه"
            placeholder="خلاصه کوتاه (حداکثر ۳۰۰ کاراکتر)"
            {...register("shortDescription")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            توضیحات کامل
          </label>
          <textarea
            rows={4}
            className="input-custom resize-none"
            placeholder="توضیحات کامل محصول..."
            {...register("description")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            راهنمای دم‌آوری
          </label>
          <textarea
            rows={3}
            className="input-custom resize-none"
            placeholder="روش دم‌آوری، نسبت آب به قهوه و..."
            {...register("brewingGuide")}
          />
        </div>
      </div>

      {/* ─── ویریانت‌ها ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
            ویریانت‌ها (وزن / قیمت)
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              append({ weightLabel: "", weight: 250, price: 0, stock: 0, grindType: "whole_bean" })
            }
          >
            <Plus size={14} /> افزودن
          </Button>
        </div>

        <div className="space-y-2">
          {fields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            >
              <Input
                placeholder="برچسب وزن"
                {...register(`variants.${i}.weightLabel`, { required: true })}
              />
              <Input
                type="number"
                placeholder="وزن (گرم)"
                {...register(`variants.${i}.weight`)}
              />
              <Input
                type="number"
                placeholder="قیمت (تومان)"
                {...register(`variants.${i}.price`, { required: true })}
              />
              <Input
                type="number"
                placeholder="موجودی"
                {...register(`variants.${i}.stock`)}
              />
              <div className="flex gap-2">
                <select
                  className="flex-1 h-11 px-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-coffee-500"
                  {...register(`variants.${i}.grindType`)}
                >
                  {Object.entries(GRIND_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── وضعیت‌ها ───────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">وضعیت</h3>
        <div className="flex flex-wrap gap-5">
          {[
            { name: "isActive",     label: "فعال" },
            { name: "isFeatured",   label: "ویژه" },
            { name: "isNew",        label: "جدید" },
            { name: "isBestSeller", label: "پرفروش" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-coffee-600 rounded"
                {...register(name)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ─── Buttons ────────────────────────────────────────── */}
      <div className="flex gap-3 justify-end pt-3 border-t border-border">
        <Button variant="secondary" type="button" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
        </Button>
      </div>
    </form>
  );
}
