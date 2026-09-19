"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { User, Package, MapPin, Heart, LogOut, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/profile",   icon: User,    label: "پروفایل" },
  { href: "/orders",    icon: Package, label: "سفارش‌هایم" },
  { href: "/addresses", icon: MapPin,  label: "آدرس‌هایم" },
  { href: "/wishlist",  icon: Heart,   label: "علاقه‌مندی‌ها" },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* User card */}
      <div className="bg-card border border-border rounded-2xl shadow-card p-4 mb-3 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-coffee-100 dark:bg-coffee-900/40 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-coffee-200 dark:ring-coffee-800">
          {session?.user?.avatar ? (
            <Image src={session.user.avatar} alt="پروفایل" width={44} height={44} className="object-cover" />
          ) : (
            <User size={20} className="text-coffee-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-foreground text-sm truncate">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 text-sm font-medium border-b border-border last:border-0 transition-all duration-150",
                active
                  ? "bg-coffee-50 dark:bg-coffee-900/20 text-coffee-700 dark:text-coffee-300"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon
                  size={16}
                  className={active ? "text-coffee-600 dark:text-coffee-400" : "text-muted-foreground"}
                />
                {item.label}
              </span>
              <ChevronLeft size={13} className={active ? "text-coffee-400" : "text-muted-foreground/40"} />
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} /> خروج از حساب
        </button>
      </nav>
    </aside>
  );
}
