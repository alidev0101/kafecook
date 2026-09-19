"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Eye } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/ui/Pagination";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatPrice, formatDate, formatNumber } from "@/lib/utils";

const STATUS_TABS = [
  { value: "", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Admin orders — reuse orders API but fetched with admin token
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", status, page, search],
    queryFn: () =>
      axios
        .get(`/api/orders?page=${page}&limit=15${status ? `&status=${status}` : ""}`)
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const columns = [
    {
      key: "orderNumber", title: "شماره سفارش",
      render: (v, row) => (
        <Link href={`/admin/orders/${row._id}`} className="font-mono text-coffee-600 hover:underline font-bold text-xs" dir="ltr">
          #{v}
        </Link>
      ),
    },
    {
      key: "user", title: "مشتری",
      render: (v, row) => (
        <div>
          <p className="text-sm text-gray-800">{v?.name || row.shippingAddress?.recipientName || "—"}</p>
          <p className="text-xs text-gray-400">{v?.email || ""}</p>
        </div>
      ),
    },
    { key: "status", title: "وضعیت", render: (v) => <OrderStatusBadge status={v} /> },
    { key: "paymentStatus", title: "پرداخت", render: (v) => <PaymentStatusBadge status={v} /> },
    {
      key: "items", title: "اقلام",
      render: (items) => <span className="text-sm">{formatNumber(items?.length || 0)} قلم</span>,
    },
    {
      key: "total", title: "مبلغ",
      render: (v) => <span className="font-semibold text-gray-800 text-sm">{formatPrice(v)}</span>,
    },
    { key: "createdAt", title: "تاریخ", render: (v) => <span className="text-xs text-gray-400">{formatDate(v)}</span> },
    {
      key: "_id", title: "",
      render: (v) => (
        <Link href={`/admin/orders/${v}`} className="p-1.5 hover:bg-coffee-50 rounded-lg inline-flex text-gray-400 hover:text-coffee-600 transition-colors">
          <Eye size={15} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="مدیریت سفارشات" description={`${formatNumber(data?.pagination?.total || 0)} سفارش`} />

      <div className="bg-white rounded-2xl shadow-card p-5">
        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatus(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                status === tab.value ? "bg-coffee-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={data?.data} loading={isLoading} />
        {data?.pagination && (
          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
