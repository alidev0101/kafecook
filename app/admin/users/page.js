"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { User } from "lucide-react";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page, role],
    queryFn: () =>
      axios
        .get(`/api/users?page=${page}&limit=20&search=${encodeURIComponent(search)}${role ? `&role=${role}` : ""}`)
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const columns = [
    {
      key: "name",
      title: "کاربر",
      render: (v, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-coffee-100 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-coffee-500" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{v}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      title: "موبایل",
      render: (v) => v ? <span dir="ltr" className="text-sm">{v}</span> : "—",
    },
    {
      key: "role",
      title: "نقش",
      render: (v) => <Badge variant={v === "ADMIN" ? "gold" : "default"}>{v === "ADMIN" ? "ادمین" : "کاربر"}</Badge>,
    },
    {
      key: "isActive",
      title: "وضعیت",
      render: (v) => <Badge variant={v ? "success" : "danger"}>{v ? "فعال" : "غیرفعال"}</Badge>,
    },
    {
      key: "lastLogin",
      title: "آخرین ورود",
      render: (v) => <span className="text-xs text-gray-400">{v ? formatDate(v) : "—"}</span>,
    },
    {
      key: "createdAt",
      title: "تاریخ ثبت‌نام",
      render: (v) => <span className="text-xs text-gray-400">{formatDate(v)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="مدیریت کاربران" description={`${data?.pagination?.total || 0} کاربر`} />

      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="جستجوی نام یا ایمیل..."
          />
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-white"
          >
            <option value="">همه نقش‌ها</option>
            <option value="USER">کاربر</option>
            <option value="ADMIN">ادمین</option>
          </select>
        </div>

        <DataTable columns={columns} data={data?.data} loading={isLoading} emptyMessage="کاربری یافت نشد" />
        {data?.pagination && (
          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
