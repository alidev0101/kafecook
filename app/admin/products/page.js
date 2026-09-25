"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Edit2,
  Trash2,
  Eye,
  Plus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import SearchInput from "@/components/admin/SearchInput";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { formatPrice, formatNumber, formatDate } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import ProductForm from "@/components/admin/ProductForm";
import { DEFAULT_IMG } from "@/lib/constants";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search, page],
    queryFn: () =>
      axios
        .get(
          `/api/products?search=${encodeURIComponent(
            search
          )}&page=${page}&limit=15`,
          {
            headers: { "x-admin": "true" },
          }
        )
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (slug) => axios.delete(`/api/products/${slug}`),
    onSuccess: () => {
      toast.success("محصول حذف شد");
      qc.invalidateQueries(["admin-products"]);
      setDeleteId(null);
    },
    onError: () => toast.error("خطا در حذف"),
  });

  const columns = [
    {
      key: "images",
      title: "تصویر",
      render: (images, row) => (
        <div className="w-12 h-12 rounded-xl bg-cream-50 overflow-hidden relative flex-shrink-0">
          <Image
            src={images[0]?.url || DEFAULT_IMG}
            alt={row.name}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      title: "نام محصول",
      render: (v, row) => (
        <div>
          <p className="font-semibold text-gray-800 text-sm">{v}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      title: "دسته‌بندی",
      render: (v) => (
        <span className="text-sm text-gray-600">{v?.name || "—"}</span>
      ),
    },
    {
      key: "basePrice",
      title: "قیمت پایه",
      render: (v) => (
        <span className="font-semibold text-gray-800 text-sm">
          {formatPrice(v)}
        </span>
      ),
    },
    {
      key: "variants",
      title: "موجودی",
      render: (variants) => {
        const totalStock = variants?.reduce((s, v) => s + v.stock, 0) || 0;
        return (
          <Badge
            variant={
              totalStock === 0
                ? "danger"
                : totalStock <= 10
                ? "warning"
                : "success"
            }
          >
            {formatNumber(totalStock)} عدد
          </Badge>
        );
      },
    },
    {
      key: "averageRating",
      title: "امتیاز",
      render: (v, row) => (
        <span className="text-sm text-gray-600">
          {v?.toFixed(1) || "—"} ({formatNumber(row.reviewsCount || 0)})
        </span>
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
      key: "createdAt",
      title: "تاریخ ثبت",
      render: (v) => (
        <span className="text-xs text-gray-400">{formatDate(v)}</span>
      ),
    },
    {
      key: "_id",
      title: "عملیات",
      render: (v, row) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/products/${row.slug}`}
            target="_blank"
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="مشاهده"
          >
            <Eye size={15} />
          </Link>
          <button
            onClick={() => setEditProduct(row)}
            className="p-1.5 text-gray-400 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => setDeleteId(row.slug)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="مدیریت محصولات"
        description={`${formatNumber(data?.pagination?.total || 0)} محصول`}
        action={{ label: "محصول جدید", onClick: () => setCreateOpen(true) }}
      />

      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="جستجوی محصول..."
          />
        </div>
        <DataTable columns={columns} data={data?.data} loading={isLoading} />
        {data?.pagination && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Create modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="محصول جدید"
        size="2xl"
      >
        <ProductForm
          onSuccess={() => {
            setCreateOpen(false);
            qc.invalidateQueries(["admin-products"]);
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="ویرایش محصول"
        size="2xl"
      >
        {editProduct && (
          <ProductForm
            product={editProduct}
            onSuccess={() => {
              setEditProduct(null);
              qc.invalidateQueries(["admin-products"]);
            }}
            onCancel={() => setEditProduct(null)}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="حذف محصول"
        message="آیا از حذف این محصول اطمینان دارید؟ این عملیات قابل بازگشت نیست."
      />
    </div>
  );
}
