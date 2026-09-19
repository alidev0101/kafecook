"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Award, ShoppingBag,
  Users, Star, Percent, BarChart2, Settings, Coffee, X, LogOut,
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

export default function AdminSidebarMobile({ isOpen, onClose }) {
  const pathname = usePathname();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-64 bg-coffee-950 flex flex-col">
        <div className="p-4 border-b border-coffee-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee size={20} className="text-coffee-300" />
            <span className="text-white font-bold">کافه کوک</span>
          </div>
          <button onClick={onClose} className="p-2 text-coffee-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active ? "bg-coffee-600 text-white" : "text-coffee-400 hover:bg-coffee-900 hover:text-coffee-200"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-coffee-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30"
          >
            <LogOut size={15} /> خروج
          </button>
        </div>
      </aside>
    </div>
  );
}
