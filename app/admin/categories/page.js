"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Edit2, Trash2, Plus } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useForm } from "react-hook-form";
import { formatDate } from "@/lib/utils";

function CategoryForm({ category, categories, onSuccess, onCancel }) {
  const isEdit = !!category;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: category
      ? { name: category.name, description: category.description, parent: category.parent?._id || "", isActive: category.isActive, isFeatured: category.isFeatured }
      : { isActive: true },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axios.put(`/api/categories/${category.slug}`, data)
        : axios.post("/api/categories", data),
    onSuccess: () => { toast.success(isEdit ? "دسته‌بندی ویرایش شد" : "دسته‌بندی ایجاد شد"); onSuccess?.(); },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <Input label="نام دسته‌بندی" required {...register("name", { required: "الزامی" })} error={errors.name?.message} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">دسته‌بندی والد</label>
        <select className="input-custom h-11" {...register("parent")}>
          <option value="">ندارد (دسته اصلی)</option>
          {categories?.filter((c) => c._id !== category?._id).map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">توضیحات</label>
        <textarea rows={3} className="input-custom resize-none" {...register("description")} />
      </div>
      <div className="flex gap-5">
        {[{ name: "isActive", label: "فعال" }, { name: "isFeatured", label: "ویژه" }].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-coffee-600 rounded" {...register(name)} />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
        <Button variant="secondary" type="button" onClick={onCancel}>انصراف</Button>
        <Button type="submit" loading={mutation.isPending}>{isEdit ? "ذخیره" : "ایجاد"}</Button>
      </div>
    </form>
  );
}

export default function AdminCategoriesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const qc = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => axios.get("/api/categories").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (slug) => axios.delete(`/api/categories/${slug}`),
    onSuccess: () => { toast.success("دسته‌بندی حذف شد"); qc.invalidateQueries(["admin-categories"]); setDeleteSlug(null); },
    onError: () => toast.error("خطا در حذف"),
  });

  const columns = [
    { key: "name", title: "نام", render: (v, row) => (<div><p className="font-semibold text-sm text-gray-800">{v}</p><p className="text-xs text-gray-400">{row.slug}</p></div>) },
    { key: "parent", title: "والد", render: (v) => v?.name ? <Badge variant="default">{v.name}</Badge> : <span className="text-gray-400 text-xs">اصلی</span> },
    { key: "isActive", title: "وضعیت", render: (v) => <Badge variant={v ? "success" : "danger"}>{v ? "فعال" : "غیرفعال"}</Badge> },
    { key: "isFeatured", title: "ویژه", render: (v) => v ? <Badge variant="gold">ویژه</Badge> : "—" },
    { key: "createdAt", title: "تاریخ", render: (v) => <span className="text-xs text-gray-400">{formatDate(v)}</span> },
    {
      key: "_id", title: "عملیات",
      render: (v, row) => (
        <div className="flex gap-1">
          <button onClick={() => setEditCat(row)} className="p-1.5 text-gray-400 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteSlug(row.slug)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="مدیریت دسته‌بندی‌ها" action={{ label: "دسته‌بندی جدید", onClick: () => setCreateOpen(true) }} />
      <div className="bg-white rounded-2xl shadow-card p-5">
        <DataTable columns={columns} data={categories} loading={isLoading} />
      </div>
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="دسته‌بندی جدید">
        <CategoryForm categories={categories} onSuccess={() => { setCreateOpen(false); qc.invalidateQueries(["admin-categories"]); }} onCancel={() => setCreateOpen(false)} />
      </Modal>
      <Modal isOpen={!!editCat} onClose={() => setEditCat(null)} title="ویرایش دسته‌بندی">
        {editCat && <CategoryForm category={editCat} categories={categories} onSuccess={() => { setEditCat(null); qc.invalidateQueries(["admin-categories"]); }} onCancel={() => setEditCat(null)} />}
      </Modal>
      <ConfirmDialog isOpen={!!deleteSlug} onClose={() => setDeleteSlug(null)} onConfirm={() => deleteMutation.mutate(deleteSlug)} loading={deleteMutation.isPending} title="حذف دسته‌بندی" message="آیا از حذف این دسته‌بندی اطمینان دارید؟" />
    </div>
  );
}
