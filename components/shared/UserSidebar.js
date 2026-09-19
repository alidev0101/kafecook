"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  User, Package, MapPin, Heart, Settings, LogOut, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/profile", icon: User, label: "پروفایل" },
  { href: "/orders", icon: Package, label: "سفارش‌هایم" },
  { href: "/addresses", icon: MapPin, label: "آدرس‌هایم" },
  { href: "/wishlist", icon: Heart, label: "علاقه‌مندی‌ها" },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* User card */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-coffee-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {session?.user?.avatar ? (
            <Image src={session.user.avatar} alt="پروفایل" width={48} height={48} className="object-cover" />
          ) : (
            <User size={22} className="text-coffee-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-800 truncate">{session?.user?.name}</p>
          <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-white rounded-2xl shadow-card overflow-hidden">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-5 py-3.5 text-sm font-medium border-b border-gray-50 last:border-0 transition-all duration-150",
                active
                  ? "bg-coffee-50 text-coffee-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} className={active ? "text-coffee-600" : "text-gray-400"} />
                {item.label}
              </span>
              <ChevronLeft size={15} className={active ? "text-coffee-400" : "text-gray-300"} />
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} />
          خروج از حساب
        </button>
      </nav>
    </aside>
  );
}
