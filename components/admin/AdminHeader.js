"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import AdminSidebarMobile from "./AdminSidebarMobile";

const pageTitles = {
  "/admin": "داشبورد",
  "/admin/products": "مدیریت محصولات",
  "/admin/categories": "مدیریت دسته‌بندی‌ها",
  "/admin/brands": "مدیریت برندها",
  "/admin/orders": "مدیریت سفارشات",
  "/admin/users": "مدیریت کاربران",
  "/admin/reviews": "مدیریت نظرات",
  "/admin/coupons": "کدهای تخفیف",
  "/admin/blog": "مدیریت وبلاگ",
  "/admin/blog/new": "مقاله جدید",
  "/admin/blog/categories": "دسته‌بندی‌های وبلاگ",
  "/admin/reports": "گزارشات",
  "/admin/settings": "تنظیمات",
};

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] || "ادمین";

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
            <div className="w-8 h-8 rounded-full bg-coffee-100 flex items-center justify-center">
              <User size={16} className="text-coffee-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {session?.user?.name}
            </span>
          </div>
        </div>
      </header>
      <AdminSidebarMobile isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
