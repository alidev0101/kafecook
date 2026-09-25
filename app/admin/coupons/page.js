"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Edit2, Trash2, Copy } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useForm } from "react-hook-form";
import { formatDate, formatPrice, formatNumber } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function CouponForm({ coupon, onSuccess, onCancel }) {
  const [endDate, setEndDate] = useState(
    coupon?.endDate ? new Date(coupon.endDate) : null
  );
  const isEdit = !!coupon;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: coupon
      ? {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minOrderAmount: coupon.minOrderAmount,
          maxUsageCount: coupon.maxUsageCount || "",
          maxUsagePerUser: coupon.maxUsagePerUser,
          isActive: coupon.isActive,
          description: coupon.description || "",
        }
      : {
          type: "percentage",
          maxUsagePerUser: 1,
          isActive: true,
          minOrderAmount: 0,
        },
  });
  const type = watch("type");

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axios.put(`/api/coupons/${coupon._id}`, data)
        : axios.post("/api/coupons", data),
    onSuccess: () => {
      toast.success(isEdit ? "کد تخفیف ویرایش شد" : "کد تخفیف ایجاد شد");
      onSuccess?.();
    },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      value: Number(data.value),
      minOrderAmount: Number(data.minOrderAmount) || 0,
      maxUsageCount: data.maxUsageCount ? Number(data.maxUsageCount) : null,
      maxUsagePerUser: Number(data.maxUsagePerUser) || 1,
      endDate: endDate ? endDate.toDate().toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="کد تخفیف"
          placeholder="COFFEE20"
          required
          className="uppercase"
          {...register("code", { required: "الزامی" })}
          error={errors.code?.message}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            نوع تخفیف *
          </label>
          <select
            className="input-custom h-11"
            {...register("type", { required: true })}
          >
            <option value="percentage">درصدی</option>
            <option value="fixed">مبلغ ثابت (تومان)</option>
          </select>
        </div>
        <Input
          label={type === "percentage" ? "درصد تخفیف" : "مبلغ تخفیف (تومان)"}
          type="number"
          required
          placeholder={type === "percentage" ? "مثلاً: ۲۰" : "مثلاً: ۵۰۰۰۰"}
          {...register("value", { required: "الزامی", min: 1 })}
          error={errors.value?.message}
        />
        <Input
          label="حداقل مبلغ سفارش (تومان)"
          type="number"
          placeholder="۰"
          {...register("minOrderAmount")}
        />
        <Input
          label="حداکثر تعداد استفاده کل"
          type="number"
          placeholder="بی‌نهایت"
          {...register("maxUsageCount")}
        />
        <Input
          label="حداکثر استفاده هر کاربر"
          type="number"
          placeholder="۱"
          {...register("maxUsagePerUser")}
        />
        <div>
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                تاریخ انقضا
              </label>

              <DatePicker
                value={endDate}
                onChange={setEndDate}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                calendarPosition="bottom-right"
                inputClass="input-custom w-full"
                placeholder="انتخاب تاریخ انقضا"
                editable={false}
                portal
                zIndex={99999}
              />
            </div>
          </div>
        </div>
      </div>
      <Input
        label="توضیحات"
        placeholder="توضیح اختیاری"
        {...register("description")}
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-coffee-600 rounded"
          {...register("isActive")}
        />
        <span className="text-sm text-gray-700">فعال</span>
      </label>
      <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
        <Button variant="secondary" type="button" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? "ذخیره" : "ایجاد"}
        </Button>
      </div>
    </form>
  );
}

export default function AdminCouponsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const qc = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => axios.get("/api/coupons").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/coupons/${id}`),
    onSuccess: () => {
      toast.success("کد تخفیف حذف شد");
      qc.invalidateQueries(["admin-coupons"]);
      setDeleteId(null);
    },
    onError: () => toast.error("خطا در حذف"),
  });

  const columns = [
    {
      key: "code",
      title: "کد",
      render: (v) => (
        <div className="flex items-center gap-2">
          <span
            className="font-mono font-bold text-coffee-700 bg-coffee-50 px-2 py-0.5 rounded-lg text-sm"
            dir="ltr"
          >
            {v}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(v);
              toast.success("کپی شد");
            }}
            className="p-1 text-gray-300 hover:text-gray-600 transition-colors"
          >
            <Copy size={12} />
          </button>
        </div>
      ),
    },
    {
      key: "type",
      title: "نوع",
      render: (v, row) => (
        <span className="text-sm">
          {v === "percentage"
            ? `${formatNumber(row.value)}٪`
            : formatPrice(row.value)}
        </span>
      ),
    },
    {
      key: "minOrderAmount",
      title: "حداقل سفارش",
      render: (v) => (v > 0 ? formatPrice(v) : "—"),
    },
    {
      key: "usedCount",
      title: "استفاده شده",
      render: (v, row) => (
        <span className="text-sm">
          {formatNumber(v)}{" "}
          {row.maxUsageCount ? `/ ${formatNumber(row.maxUsageCount)}` : ""}
        </span>
      ),
    },
    {
      key: "endDate",
      title: "انقضا",
      render: (v) =>
        v ? (
          <span className="text-xs text-gray-500">{formatDate(v)}</span>
        ) : (
          <span className="text-gray-400 text-xs">بی‌نهایت</span>
        ),
    },
    {
      key: "isActive",
      title: "وضعیت",
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      key: "_id",
      title: "عملیات",
      render: (v, row) => (
        <div className="flex gap-1">
          <button
            onClick={() => setEditCoupon(row)}
            className="p-1.5 text-gray-400 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(v)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="کدهای تخفیف"
        description={`${formatNumber(coupons?.length || 0)} کد تخفیف`}
        action={{ label: "کد جدید", onClick: () => setCreateOpen(true) }}
      />
      <div className="bg-white rounded-2xl shadow-card p-5">
        <DataTable
          columns={columns}
          data={coupons}
          loading={isLoading}
          emptyMessage="کد تخفیفی وجود ندارد"
        />
      </div>
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="کد تخفیف جدید"
      >
        <CouponForm
          onSuccess={() => {
            setCreateOpen(false);
            qc.invalidateQueries(["admin-coupons"]);
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={!!editCoupon}
        onClose={() => setEditCoupon(null)}
        title="ویرایش کد تخفیف"
      >
        {editCoupon && (
          <CouponForm
            coupon={editCoupon}
            onSuccess={() => {
              setEditCoupon(null);
              qc.invalidateQueries(["admin-coupons"]);
            }}
            onCancel={() => setEditCoupon(null)}
          />
        )}
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="حذف کد تخفیف"
        message="آیا از حذف این کد تخفیف اطمینان دارید؟"
      />
    </div>
  );
}
