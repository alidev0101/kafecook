"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Trash2, Search, MessageSquare } from "lucide-react";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatDate, formatNumber } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";

const STATUS_TABS = [
  { value: "",          label: "همه",           icon: null },
  { value: "pending",   label: "در انتظار",      icon: Clock },
  { value: "approved",  label: "تأیید شده",      icon: CheckCircle },
  { value: "rejected",  label: "رد شده",         icon: XCircle },
];

const STATUS_CONFIG = {
  pending:  { label: "در انتظار",    variant: "warning" },
  approved: { label: "تأیید شده",   variant: "success" },
  rejected: { label: "رد شده",      variant: "danger"  },
};

export default function AdminReviewsPage() {
  const [status, setStatus]         = useState("");
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [deleteId, setDeleteId]     = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const qc = useQueryClient();

  // ─── Fetch ───────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-reviews", status, page, search],
    queryFn: () =>
      axios
        .get(
          `/api/admin/reviews?page=${page}&limit=15${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`
        )
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const reviews   = data?.data || [];
  const pagMeta   = data?.pagination || {};
  const stats     = pagMeta?.stats || {};

  // ─── Mutations ────────────────────────────────────────────────────────
  const patchMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axios.patch(`/api/admin/reviews/${id}`, { status }),
    onSuccess: (_, vars) => {
      const labels = { approved: "تأیید شد", rejected: "رد شد", pending: "به انتظار برگشت" };
      toast.success(`نظر ${labels[vars.status] || "بروزرسانی شد"}`);
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("خطا در بروزرسانی نظر"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/admin/reviews/${id}`),
    onSuccess: () => {
      toast.success("نظر حذف شد");
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      setDeleteId(null);
    },
    onError: () => toast.error("خطا در حذف نظر"),
  });

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <PageHeader
        title="مدیریت نظرات"
        description="بررسی، تأیید و حذف نظرات کاربران"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "در انتظار",  value: stats.pending,  color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800" },
          { label: "تأیید شده", value: stats.approved, color: "bg-green-50  text-green-700  dark:bg-green-900/20  dark:text-green-400",  border: "border-green-200 dark:border-green-800" },
          { label: "رد شده",    value: stats.rejected, color: "bg-red-50    text-red-700    dark:bg-red-900/20    dark:text-red-400",    border: "border-red-200 dark:border-red-800" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color} ${s.border}`}>
            <p className="text-2xl font-black">{formatNumber(s.value || 0)}</p>
            <p className="text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setStatus(tab.value); setPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  status === tab.value
                    ? "bg-coffee-600 text-white shadow-warm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.icon && <tab.icon size={14} />}
                {tab.label}
                {tab.value === "pending" && stats.pending > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${status === "pending" ? "bg-white/20 text-white" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"}`}>
                    {formatNumber(stats.pending)}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="جستجو در نظرات..."
              className="h-10 pr-9 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 w-full sm:w-56 transition-all"
            />
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            <p>خطا در بارگذاری نظرات</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">نظری یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {reviews.map((review) => (
              <ReviewRow
                key={review._id}
                review={review}
                expanded={expandedId === review._id}
                onToggle={() => setExpandedId(expandedId === review._id ? null : review._id)}
                onApprove={() => patchMutation.mutate({ id: review._id, status: "approved" })}
                onReject={() => patchMutation.mutate({ id: review._id, status: "rejected" })}
                onDelete={() => setDeleteId(review._id)}
                loading={patchMutation.isPending && patchMutation.variables?.id === review._id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagMeta?.totalPages > 1 && (
          <Pagination
            page={pagMeta.page}
            totalPages={pagMeta.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="حذف نظر"
        message="آیا از حذف این نظر اطمینان دارید؟ این عملیات قابل بازگشت نیست."
      />
    </div>
  );
}

// ─── ReviewRow ────────────────────────────────────────────────────────────────
function ReviewRow({ review, expanded, onToggle, onApprove, onReject, onDelete, loading }) {
  const cfg = STATUS_CONFIG[review.status] || STATUS_CONFIG.pending;
  const productImage = review.product?.images?.[0]?.url;

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-4">
        {/* Product thumb */}
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative flex-shrink-0">
          {productImage ? (
            <Image src={productImage} alt={review.product?.name || ""} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg opacity-20 dark:opacity-10">☕</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
              {review.user?.name || "کاربر ناشناس"}
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {review.product?.name || "محصول نامشخص"}
            </span>
            <StarRating rating={review.rating} size="xs" />
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
            {review.isVerifiedPurchase && (
              <Badge variant="success">خرید تأیید شده</Badge>
            )}
          </div>

          {/* Review title */}
          {review.title && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-0.5">{review.title}</p>
          )}

          {/* Body - truncated */}
          <p
            className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
          >
            {review.body}
          </p>

          {review.body?.length > 120 && (
            <button
              onClick={onToggle}
              className="text-xs text-coffee-600 dark:text-coffee-400 hover:underline mt-0.5"
            >
              {expanded ? "کمتر" : "بیشتر..."}
            </button>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {review.status !== "approved" && (
            <button
              onClick={onApprove}
              disabled={loading}
              title="تأیید"
              className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={17} />
            </button>
          )}
          {review.status !== "rejected" && (
            <button
              onClick={onReject}
              disabled={loading}
              title="رد"
              className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors disabled:opacity-50"
            >
              <XCircle size={17} />
            </button>
          )}
          <button
            onClick={onDelete}
            title="حذف"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
