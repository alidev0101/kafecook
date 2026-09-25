"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useForm } from "react-hook-form";
import { formatDate } from "@/lib/utils";

function BrandForm({ brand, onSuccess, onCancel }) {
  const isEdit = !!brand;
  const { register, handleSubmit } = useForm({
    defaultValues: brand
      ? { name: brand.name, description: brand.description, website: brand.website, origin: brand.origin, isActive: brand.isActive, isFeatured: brand.isFeatured }
      : { isActive: true },
  });
  const mutation = useMutation({
    mutationFn: (data) => isEdit ? axios.put(`/api/brands/${brand.slug}`, data) : axios.post("/api/brands", data),
    onSuccess: () => { toast.success(isEdit ? "برند ویرایش شد" : "برند ایجاد شد"); onSuccess?.(); },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });
  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <Input label="نام برند" required {...register("name", { required: "الزامی" })} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="وب‌سایت" placeholder="https://..." dir="ltr" {...register("website")} />
        <Input label="کشور مبدأ" placeholder="مثلاً: ایتالیا" {...register("origin")} />
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

export default function AdminBrandsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const qc = useQueryClient();

  const { data: brands, isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => axios.get("/api/brands").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (slug) => axios.delete(`/api/brands/${slug}`),
    onSuccess: () => { toast.success("برند حذف شد"); qc.invalidateQueries(["admin-brands"]); setDeleteSlug(null); },
    onError: () => toast.error("خطا در حذف"),
  });

  const columns = [
    { key: "name", title: "نام", render: (v, row) => (<div><p className="font-semibold text-sm text-gray-800">{v}</p><p className="text-xs text-gray-400">{row.slug}</p></div>) },
    { key: "origin", title: "کشور", render: (v) => v || "—" },
    { key: "website", title: "وب‌سایت", render: (v) => v ? <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs" dir="ltr">{v}</a> : "—" },
    { key: "isActive", title: "وضعیت", render: (v) => <Badge variant={v ? "success" : "danger"}>{v ? "فعال" : "غیرفعال"}</Badge> },
    { key: "isFeatured", title: "ویژه", render: (v) => v ? <Badge variant="gold">ویژه</Badge> : "—" },
    { key: "createdAt", title: "تاریخ", render: (v) => <span className="text-xs text-gray-400">{formatDate(v)}</span> },
    {
      key: "_id", title: "عملیات",
      render: (v, row) => (
        <div className="flex gap-1">
          <button onClick={() => setEditBrand(row)} className="p-1.5 text-gray-400 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteSlug(row.slug)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="مدیریت برندها" action={{ label: "برند جدید", onClick: () => setCreateOpen(true) }} />
      <div className="bg-white rounded-2xl shadow-card p-5">
        <DataTable columns={columns} data={brands} loading={isLoading} />
      </div>
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="برند جدید">
        <BrandForm onSuccess={() => { setCreateOpen(false); qc.invalidateQueries(["admin-brands"]); }} onCancel={() => setCreateOpen(false)} />
      </Modal>
      <Modal isOpen={!!editBrand} onClose={() => setEditBrand(null)} title="ویرایش برند">
        {editBrand && <BrandForm brand={editBrand} onSuccess={() => { setEditBrand(null); qc.invalidateQueries(["admin-brands"]); }} onCancel={() => setEditBrand(null)} />}
      </Modal>
      <ConfirmDialog isOpen={!!deleteSlug} onClose={() => setDeleteSlug(null)} onConfirm={() => deleteMutation.mutate(deleteSlug)} loading={deleteMutation.isPending} title="حذف برند" message="آیا از حذف این برند اطمینان دارید؟" />
    </div>
  );
}
