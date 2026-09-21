"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PRESET_COLORS = [
  "#be7040", "#92462c", "#d4a853",
  "#4f7942", "#2d6a8f", "#7b4fa6",
  "#c0392b", "#e67e22", "#1abc9c",
];

function CategoryForm({ category, onSuccess, onCancel }) {
  const isEdit = !!category;
  const [name,        setName]        = useState(category?.name        || "");
  const [slug,        setSlug]        = useState(category?.slug        || "");
  const [description, setDescription] = useState(category?.description || "");
  const [color,       setColor]       = useState(category?.color       || "#be7040");
  const [order,       setOrder]       = useState(category?.order       || 0);
  const [isActive,    setIsActive]    = useState(category?.isActive    ?? true);
  const [slugManual,  setSlugManual]  = useState(isEdit);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axios.put(`/api/admin/blog-categories/${category._id}`, data)
        : axios.post("/api/admin/blog-categories", data),
    onSuccess: () => { toast.success(isEdit ? "دسته‌بندی ویرایش شد" : "دسته‌بندی ایجاد شد"); onSuccess?.(); },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });

  const handleNameChange = (val) => {
    setName(val);
    if (!slugManual) {
      setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-z0-9-]/g, "").replace(/-+/g, "-"));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("نام دسته‌بندی الزامی است"); return; }
    mutation.mutate({ name: name.trim(), slug: slug.trim() || undefined, description: description.trim(), color, order: Number(order), isActive });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="نام دسته‌بندی" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="مثلاً: آموزش دم‌آوری" required />

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Slug (آدرس URL)</label>
        <input
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
          placeholder="brewing-guide"
          dir="ltr"
          className="input-custom font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">توضیحات</label>
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="input-custom resize-none" placeholder="توضیح اختیاری..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">رنگ دسته‌بندی</label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-transform ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
            title="رنگ دلخواه"
          />
          <span className="text-xs text-muted-foreground font-mono">{color}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input type="number" label="ترتیب نمایش" value={order} onChange={(e) => setOrder(e.target.value)} min={0} />
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer h-11">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-coffee-600 rounded" />
            <span className="text-sm text-foreground">فعال</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <Button variant="secondary" type="button" onClick={onCancel}>انصراف</Button>
        <Button type="submit" loading={mutation.isPending}>{isEdit ? "ذخیره" : "ایجاد"}</Button>
      </div>
    </form>
  );
}

export default function BlogCategoriesAdminPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat,    setEditCat]    = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const qc = useQueryClient();

  const { data: cats, isLoading } = useQuery({
    queryKey: ["admin-blog-cats"],
    queryFn: () => axios.get("/api/admin/blog-categories").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/admin/blog-categories/${id}`),
    onSuccess: () => { toast.success("دسته‌بندی حذف شد"); qc.invalidateQueries(["admin-blog-cats"]); setDeleteId(null); },
    onError: () => toast.error("خطا در حذف"),
  });

  const invalidate = () => { qc.invalidateQueries(["admin-blog-cats"]); setCreateOpen(false); setEditCat(null); };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors">
            <ArrowRight size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">دسته‌بندی‌های وبلاگ</h1>
            <p className="text-sm text-muted-foreground mt-0.5">مدیریت دسته‌بندی مقالات</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={15} /> دسته جدید
        </Button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : !cats?.length ? (
          <div className="py-14 text-center text-muted-foreground">
            <Tag size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">هیچ دسته‌بندی‌ای وجود ندارد</p>
            <button onClick={() => setCreateOpen(true)} className="mt-3 text-sm text-coffee-600 dark:text-coffee-400 hover:underline">
              اولین دسته را بساز
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {cats.map((cat) => (
              <div key={cat._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                {/* Color dot */}
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || "#be7040" }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                    {!cat.isActive && <Badge variant="danger">غیرفعال</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">/blog/category/{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{cat.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditCat(cat)} className="p-1.5 rounded-lg text-muted-foreground hover:text-coffee-600 dark:hover:text-coffee-400 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 transition-colors" title="ویرایش">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setDeleteId(cat._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="حذف">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="دسته‌بندی جدید">
        <CategoryForm onSuccess={invalidate} onCancel={() => setCreateOpen(false)} />
      </Modal>
      <Modal isOpen={!!editCat} onClose={() => setEditCat(null)} title="ویرایش دسته‌بندی">
        {editCat && <CategoryForm category={editCat} onSuccess={invalidate} onCancel={() => setEditCat(null)} />}
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="حذف دسته‌بندی"
        message="آیا از حذف این دسته‌بندی اطمینان دارید؟ مقالات مرتبط بدون دسته‌بندی خواهند ماند."
      />
    </div>
  );
}
