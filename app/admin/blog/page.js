"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Search,
  Globe, FileText, TrendingUp, Clock, Filter,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Skeleton from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";
import { formatDate, formatNumber } from "@/lib/utils";

const DEFAULT_IMG = "/images/default-product.svg";

const STATUS_TABS = [
  { value: "",          label: "همه",        icon: Filter },
  { value: "published", label: "منتشرشده",  icon: Globe },
  { value: "draft",     label: "پیش‌نویس",  icon: FileText },
];

const POST_TYPE_LABELS = {
  article:        "مقاله",
  tutorial:       "آموزش",
  news:           "اخبار",
  product_review: "معرفی محصول",
  brewing_guide:  "روش دم‌آوری",
};

export default function AdminBlogPage() {
  const [status,   setStatus]   = useState("");
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts", status, search, page],
    queryFn: () =>
      axios
        .get(`/api/admin/posts?page=${page}&limit=15${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`)
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/admin/posts/${id}`),
    onSuccess: () => {
      toast.success("مقاله حذف شد");
      qc.invalidateQueries(["admin-posts"]);
      setDeleteId(null);
    },
    onError: () => toast.error("خطا در حذف"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, newStatus }) =>
      axios.patch(`/api/admin/posts/${id}`, { status: newStatus }),
    onSuccess: (_, { newStatus }) => {
      toast.success(newStatus === "published" ? "مقاله منتشر شد" : "به پیش‌نویس تبدیل شد");
      qc.invalidateQueries(["admin-posts"]);
    },
    onError: () => toast.error("خطا در تغییر وضعیت"),
  });

  const counts = data?.pagination?.counts;
  const posts  = data?.data || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">مدیریت وبلاگ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            مقالات، آموزش‌ها و محتوای تخصصی قهوه
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blog/categories">
            <Button variant="secondary" size="sm">دسته‌بندی‌ها</Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button size="sm"><Plus size={15} /> مقاله جدید</Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      {counts && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "کل مقالات", value: counts.all,       icon: FileText,   color: "bg-gray-50 dark:bg-gray-800/50  text-gray-700 dark:text-gray-300"   },
            { label: "منتشرشده",  value: counts.published, icon: Globe,      color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" },
            { label: "پیش‌نویس", value: counts.draft,     icon: FileText,   color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border border-border p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={15} />
                <p className="text-xs font-medium">{label}</p>
              </div>
              <p className="text-2xl font-black">{formatNumber(value || 0)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
          {/* Status tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setStatus(tab.value); setPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  status === tab.value
                    ? "bg-coffee-600 text-white shadow-warm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="جستجو در مقالات..."
              className="h-10 pr-9 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-coffee-500 w-full transition-all"
            />
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">مقاله‌ای یافت نشد</p>
            <Link href="/admin/blog/new" className="mt-3 inline-block">
              <Button size="sm"><Plus size={14} /> اولین مقاله را بنویس</Button>
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative flex-shrink-0">
                    <Image
                      src={post.featuredImage?.url || DEFAULT_IMG}
                      alt={post.title}
                      fill
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate flex-1">
                        {post.title}
                      </p>
                      <Badge variant={post.status === "published" ? "success" : "warning"}>
                        {post.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                      </Badge>
                      {post.isFeatured && <Badge variant="gold">ویژه</Badge>}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      {post.category && (
                        <span className="font-medium text-coffee-600 dark:text-coffee-400">
                          {post.category.name}
                        </span>
                      )}
                      <span>{POST_TYPE_LABELS[post.postType] || "مقاله"}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {formatNumber(post.readTime)} دقیقه
                      </span>
                      {post.status === "published" && post.publishedAt && (
                        <span>{formatDate(post.publishedAt)}</span>
                      )}
                      {post.viewCount > 0 && (
                        <span className="flex items-center gap-1">
                          <TrendingUp size={10} /> {formatNumber(post.viewCount)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Toggle publish */}
                    <button
                      onClick={() =>
                        toggleMutation.mutate({
                          id: post._id,
                          newStatus: post.status === "published" ? "draft" : "published",
                        })
                      }
                      title={post.status === "published" ? "لغو انتشار" : "انتشار"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        post.status === "published"
                          ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          : "text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {post.status === "published" ? <Globe size={15} /> : <EyeOff size={15} />}
                    </button>

                    {/* Preview */}
                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="مشاهده"
                      >
                        <Eye size={15} />
                      </Link>
                    )}

                    {/* Edit */}
                    <Link
                      href={`/admin/blog/${post._id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-coffee-600 dark:hover:text-coffee-400 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 transition-colors"
                      title="ویرایش"
                    >
                      <Edit2 size={15} />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(post._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {data?.pagination && (
          <div className="px-4 pb-2">
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="حذف مقاله"
        message="آیا از حذف این مقاله اطمینان دارید؟ این عملیات قابل بازگشت نیست."
      />
    </div>
  );
}
