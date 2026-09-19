"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Award, ShoppingBag,
  Users, Star, Percent, BarChart2, Settings, Coffee,
  LogOut, ChevronLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "داشبورد", exact: true },
  { href: "/admin/products", icon: Package, label: "محصولات" },
  { href: "/admin/categories", icon: Tag, label: "دسته‌بندی‌ها" },
  { href: "/admin/brands", icon: Award, label: "برندها" },
  { href: "/admin/orders", icon: ShoppingBag, label: "سفارشات" },
  { href: "/admin/users", icon: Users, label: "کاربران" },
  { href: "/admin/reviews", icon: Star, label: "نظرات" },
  { href: "/admin/coupons", icon: Percent, label: "کدهای تخفیف" },
  { href: "/admin/reports", icon: BarChart2, label: "گزارشات" },
  { href: "/admin/settings", icon: Settings, label: "تنظیمات" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside className="hidden lg:flex w-60 flex-shrink-0 bg-coffee-950 flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-coffee-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-coffee-500/20 border border-coffee-500/30 flex items-center justify-center">
            <Coffee size={18} className="text-coffee-300" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">کافه کوک</p>
            <p className="text-coffee-500 text-[10px]">پنل مدیریت</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-coffee-600 text-white"
                  : "text-coffee-400 hover:bg-coffee-900 hover:text-coffee-200"
              )}
            >
              <span className="flex items-center gap-2.5">
                <item.icon size={16} />
                {item.label}
              </span>
              {active && <ChevronLeft size={14} className="text-coffee-300" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-coffee-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-coffee-400 hover:bg-coffee-900 hover:text-coffee-200 transition-all"
        >
          <Coffee size={15} />
          مشاهده فروشگاه
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
        >
          <LogOut size={15} />
          خروج
        </button>
      </div>
    </aside>
  );
}
