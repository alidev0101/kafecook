"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { User, Edit, UserCheck, UserRoundX, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import UserForm from "@/components/admin/UserForm";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [changingUserId, setChangingUserId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page, role],
    queryFn: () =>
      axios
        .get(
          `/api/users?page=${page}&limit=20&search=${encodeURIComponent(
            search
          )}${role ? `&role=${role}` : ""}`
        )
        .then((r) => r.data),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      axios.patch(`/api/users/${id}/status`, { isActive }),

    onMutate: ({ id }) => {
      setChangingUserId(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },

    onSettled: () => {
      setChangingUserId(null);
    },
  });

  const handleEdit = (user) => {
    setEditingUser(user);
  };

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
      render: (v) =>
        v ? (
          <span dir="ltr" className="text-sm">
            {v}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "role",
      title: "نقش",
      render: (v) => (
        <Badge variant={v === "ADMIN" ? "gold" : "default"}>
          {v === "ADMIN" ? "ادمین" : "کاربر"}
        </Badge>
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
      key: "lastLogin",
      title: "آخرین ورود",
      render: (v) => (
        <span className="text-xs text-gray-400">{v ? formatDate(v) : "—"}</span>
      ),
    },
    {
      key: "createdAt",
      title: "تاریخ ثبت‌نام",
      render: (v) => (
        <span className="text-xs text-gray-400">{formatDate(v)}</span>
      ),
    },
    {
      key: "actions",
      title: "عملیات",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleEdit(row)}
            className="p-1.5 text-gray-400 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-colors"
            title="ویرایش"
          >
            <Edit size={15} />
          </button>

          <button
            type="button"
            disabled={changingUserId === row._id}
            onClick={() =>
              statusMutation.mutate({
                id: row._id,
                isActive: !row.isActive,
              })
            }
            className={`p-2 rounded-lg ${
              row.isActive
                ? "text-red-500 hover:bg-red-50"
                : "text-green-500 hover:bg-green-50"
            }`}
            title={row.isActive ? "غیرفعال کردن" : "فعال کردن"}
          >
            {changingUserId === row._id ? (
              <Loader2 size={15} className="animate-spin" />
            ) : row.isActive ? (
              <UserRoundX size={15} />
            ) : (
              <UserCheck size={15} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="مدیریت کاربران"
        description={`${data?.pagination?.total || 0} کاربر`}
      />

      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="جستجوی نام یا ایمیل..."
          />
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-white"
          >
            <option value="">همه نقش‌ها</option>
            <option value="USER">کاربر</option>
            <option value="ADMIN">ادمین</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          emptyMessage="کاربری یافت نشد"
        />
        {data?.pagination && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="ویرایش کاربر"
      >
        <UserForm
          user={editingUser}
          onSuccess={() => {
            setEditingUser(null);
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
          }}
          onCancel={() => setEditingUser(null)}
        />
      </Modal>
    </div>
  );
}
