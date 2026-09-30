"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
  Coffee,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import ThemeToggle from "@/components/shared/ThemeToggle";
import SearchBar from "@/components/shared/SearchBar";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/brands", label: "برندها" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const userMenuRef = useRef(null);
  const itemsCount = useCartStore((s) => s.getItemsCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-40 pt-3 transition-all duration-300"
        )}
      >
        <div className="container-custom">
          <div
            className={cn(
              "relative rounded-2xl transition-all duration-300 glass-strong shadow-[0_18px_40px_-20px_rgba(60,30,10,0.45)]")}
          >
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5">
              {/* ── Logo ── */}
              <Link
                href="/"
                className="flex items-center gap-2 flex-shrink-0 group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-coffee-400 to-coffee-600 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_8px_18px_-8px_rgba(190,112,64,0.7)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_10px_24px_-8px_rgba(190,112,64,0.8)] transition-shadow">
                  <Coffee size={18} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-morabba text-lg font-black text-coffee-800 dark:text-coffee-200 leading-tight">
                    کافه کوک
                  </p>
                  <p className="text-[9px] text-coffee-700 dark:text-coffee-400 -mt-0.5 leading-tight tracking-wide">
                    قهوه تخصصی کرمان
                  </p>
                </div>
              </Link>

              {/* ── Desktop Nav ── */}
              <nav
                className="hidden lg:flex items-center gap-0.5"
                aria-label="ناوبری اصلی"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-2 text-md font-medium rounded-xl transition-all duration-200 text-coffee-900 dark:text-coffee-100",
                      isActive(link.href)
                        ? " bg-coffee-500/10 dark:bg-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                        : " hover:text-foreground hover:bg-white/40 dark:hover:bg-white/[0.05]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* ── Actions ── */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="جستجو"
                  className="p-2.5 rounded-xl hover:text-foreground hover:bg-accent transition-all"
                >
                  <Search size={19} />
                </button>

                {/* Dark mode toggle */}
                <ThemeToggle />

                {/* Wishlist */}
                {session && (
                  <Link
                    href="/wishlist"
                    aria-label="علاقه‌مندی‌ها"
                    className="hidden sm:block p-2.5 rounded-xl hover:text-foreground hover:bg-accent transition-all"
                  >
                    <Heart size={19} />
                  </Link>
                )}

                {/* Cart */}
                <Link
                  href="/cart"
                  aria-label="سبد خرید"
                  className="relative p-2.5 rounded-xl hover:text-foreground hover:bg-accent transition-all"
                >
                  <ShoppingCart size={19} />
                  <AnimatePresence>
                    {mounted && itemsCount > 0 && (
                      <motion.span
                        key="cart-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-gradient-to-b from-coffee-400 to-coffee-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_4px_10px_-3px_rgba(190,112,64,0.8)]"
                      >
                        {itemsCount > 9 ? "۹+" : itemsCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* User Menu */}
                {session ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 pr-2 pl-2.5 py-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/[0.05] transition-all"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-7 h-7 rounded-full bg-coffee-100 dark:bg-coffee-900/40 flex items-center justify-center overflow-hidden ring-2 ring-white/70 dark:ring-coffee-500/30">
                        {session.user.avatar ? (
                          <Image
                            src={session.user.avatar}
                            alt="پروفایل"
                            width={28}
                            height={28}
                            className="object-cover"
                          />
                        ) : (
                          <User
                            size={14}
                            className="text-coffee-600 dark:text-coffee-400"
                          />
                        )}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-foreground max-w-[72px] truncate">
                        {session.user.name?.split(" ")[0]}
                      </span>
                      <ChevronDown
                        size={13}
                        className={cn(
                          "text-muted-foreground transition-transform duration-200",
                          userMenuOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="bg-background absolute left-0 top-full mt-4 w-52 rounded-2xl py-1.5 z-50"
                        >
                          {/* User info */}
                          <div className="px-4 py-2.5 border-b border-black/[0.06] dark:border-white/10 mb-1">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {session.user.email}
                            </p>
                          </div>

                          {[
                            { href: "/profile", icon: User, label: "پروفایل من" },
                            {
                              href: "/orders",
                              icon: Package,
                              label: "سفارش‌هایم",
                            },
                            {
                              href: "/addresses",
                              icon: MapPin,
                              label: "آدرس‌هایم",
                            },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/50 dark:hover:bg-white/[0.06] hover:text-coffee-700 dark:hover:text-coffee-200 transition-colors"
                            >
                              <Icon size={15} className="text-muted-foreground" />
                              {label}
                            </Link>
                          ))}

                          {session.user.role === "ADMIN" && (
                            <>
                              <div className="border-t border-black/[0.06] dark:border-white/10 my-1" />
                              <Link
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-coffee-700 dark:text-coffee-200 font-medium hover:bg-white/50 dark:hover:bg-white/[0.06] transition-colors"
                              >
                                <LayoutDashboard size={15} />
                                پنل ادمین
                              </Link>
                            </>
                          )}

                          <div className="border-t border-black/[0.06] dark:border-white/10 my-1" />
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: "/" });
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={15} />
                            خروج
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-coffee-400 to-coffee-600 hover:from-coffee-300 hover:to-coffee-500 text-white text-sm font-medium rounded-xl transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_8px_20px_-8px_rgba(190,112,64,0.7)]"
                  >
                    <User size={14} />
                    ورود
                  </Link>
                )}

                {/* Mobile toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="منو"
                  aria-expanded={mobileOpen}
                  className="lg:hidden p-2.5 rounded-xl text-muted-foreground hover:bg-white/40 dark:hover:bg-white/[0.05] transition-all"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={mobileOpen ? "close" : "open"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>

            {/* ── Mobile Nav ── */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="glass-divider mx-4" />
                  <nav className="px-3 py-3 flex flex-col gap-0.5">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                            isActive(link.href)
                              ? "bg-coffee-500/10 dark:bg-white/[0.07] text-coffee-700 dark:text-coffee-200"
                              : "text-foreground hover:bg-white/40 dark:hover:bg-white/[0.05]"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    {!session && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="pt-2"
                      >
                        <Link
                          href="/login"
                          className="flex items-center justify-center gap-2 mx-1 px-4 py-2.5 bg-gradient-to-b from-coffee-400 to-coffee-600 text-white text-sm font-medium rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_8px_20px_-8px_rgba(190,112,64,0.7)]"
                        >
                          <User size={15} /> ورود / ثبت‌نام
                        </Link>
                      </motion.div>
                    )}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
