"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Tag, ArrowLeft, ArrowUpLeft, Clock, Coffee, Gift, Percent} from "lucide-react";

/* shared glass surface — same as the other sections */
const glass =
  "bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl " +
  "border border-white/80 dark:border-white/[0.08] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_12px_32px_-16px_rgba(90,50,20,0.22)] " +
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.65)]";

/* cursor-follow spotlight: writes --x / --y onto the card */
function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}



const offers = [
  {
    badge: "محصول هفته",
    icon: Coffee,
    title: "اتیوپی یرگاچف",
    href: "/products",
    tint: "bg-amber-400/30 dark:bg-amber-500/15",
    tile: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300",
    badgeColor: "text-amber-600 dark:text-amber-400",
    linkColor: "text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200",
  },
  {
    badge: "محدود",
    badgeIcon: Clock,
    icon: Gift,
    title: "ست هدیه قهوه",
    href: "/products",
    tint: "bg-emerald-400/30 dark:bg-emerald-500/15",
    tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300",
    badgeColor: "text-emerald-600 dark:text-emerald-400",
    linkColor: "text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200",
  },
];

export default function SpecialOffers() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-muted/20 dark:bg-background">
      {/* soft color behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-[10%] h-[320px] w-[320px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[100px]" />
        <div className="absolute bottom-0 left-[8%] h-[300px] w-[300px] rounded-full bg-amber-300/25 dark:bg-amber-700/[0.12] blur-[100px]" />
      </div>

      <div className="container-custom relative">
        <div className="grid md:grid-cols-2 gap-5">

          {/* ── Big banner ── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden p-8 md:p-10 text-white min-h-[240px] flex flex-col justify-between
              bg-gradient-to-br from-coffee-700 via-coffee-800 to-coffee-950
              border border-white/10
              shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_30px_60px_-30px_rgba(60,30,10,0.7)]"
          >
            {/* orbs + ghost icon */}
            <div aria-hidden className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
            <div aria-hidden className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-coffee-300/20 blur-3xl" />
            <Percent
              aria-hidden
              strokeWidth={1}
              className="absolute -bottom-8 -left-6 h-48 w-48 text-white/[0.06]"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium mb-4
                bg-white/10 backdrop-blur-md border border-white/15
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]">
                <Tag size={12} strokeWidth={1.75} /> تخفیف ویژه
              </div>

              <h3
                className="text-2xl md:text-3xl font-black mb-2 leading-snug"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                تا ۴۰٪ تخفیف
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-coffee-100 to-amber-300">
                  روی قهوه‌های ویژه
                </span>
              </h3>

              <p className="text-coffee-200/85 text-sm mb-6">فقط تا پایان این ماه</p>

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-coffee-800
                  bg-white/90 hover:bg-white
                  shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_10px_24px_-10px_rgba(0,0,0,0.5)]
                  hover:-translate-y-0.5 transition-all duration-300"
              >
                مشاهده پیشنهادها
                <ArrowLeft size={14} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            </div>
          </motion.div> 

          {/* ── Two small banners ── */}
          <div className="grid grid-rows-2 gap-5">
            {offers.map(({ badge, badgeIcon: BadgeIcon, icon: Icon, title, href, tint, tile, badgeColor, linkColor }, i) => (
              <motion.div
                key={title}
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full"
              >
                <Link
                  href={href}
                  onMouseMove={trackPointer}
                  className={`${glass} relative flex h-full items-center justify-between overflow-hidden rounded-3xl p-6
                    hover:-translate-y-1 hover:border-coffee-400/40 dark:hover:border-coffee-400/25 transition-all duration-300`}
                >
                  {/* tint orb */}
                  <div aria-hidden className={`pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full blur-3xl ${tint}`} />
                  {/* spotlight */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(200px circle at var(--x, 50%) var(--y, 50%), rgba(190,112,64,0.16), transparent 70%)",
                    }}
                  />

                  <div className="relative">
                    <div className={`flex items-center gap-1.5 mb-1.5 text-xs font-medium ${badgeColor}`}>
                      {BadgeIcon && <BadgeIcon size={12} strokeWidth={1.75} />} {badge}
                    </div>
                    <h4
                      className="text-xl font-bold text-foreground/95 mb-2.5"
                      style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                    >
                      {title}
                    </h4>
                    <span className={`text-sm font-medium inline-flex items-center gap-1 ${linkColor}`}>
                      سفارش بده
                      <ArrowLeft size={13} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-x-1" />
                    </span>
                  </div>

                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md
                      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] ${tile}
                      transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon size={28} strokeWidth={1.5} />
                  </div>

                  <ArrowUpLeft
                    size={15}
                    strokeWidth={1.75}
                    className="absolute top-3.5 left-3.5 text-coffee-500 dark:text-coffee-300
                      opacity-0 translate-x-1 translate-y-1
                      group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
                      transition-all duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}