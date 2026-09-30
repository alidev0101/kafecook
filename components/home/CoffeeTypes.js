"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Coffee, Droplets, Snowflake, Flame } from "lucide-react";

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


const types = [
  {
    name: "اسپرسو",
    desc: "غلیظ، شدید، با کرمای طلایی.",
    icon: Coffee,
    tile: "bg-coffee-500/15 border-coffee-400/25 text-coffee-700 dark:text-coffee-200",
  },
  {
    name: "فیلتر",
    desc: "ظریف، معطر، با تمام لایه‌های طعم.",
    icon: Droplets,
    tile: "bg-amber-500/12 border-amber-500/20 text-amber-700 dark:text-amber-300",
  },
  {
    name: "کولد برو",
    desc: "دم‌آوری سرد ۱۲ تا ۲۴ ساعته.",
    icon: Snowflake,
    tile: "bg-sky-500/12 border-sky-500/20 text-sky-700 dark:text-sky-300",
  },
  {
    name: "موکاپات",
    desc: "قوی، با عمق و کاراکتر خاص.",
    icon: Flame,
    tile: "bg-red-500/12 border-red-500/20 text-red-700 dark:text-red-300",
  },
];

export default function CoffeeTypes() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background">
      {/* soft color behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-[10%] h-[340px] w-[340px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px]" />
        <div className="absolute -bottom-20 right-[8%] h-[320px] w-[320px] rounded-full bg-amber-300/20 dark:bg-amber-700/[0.12] blur-[110px]" />
      </div>

      <div className="container-custom relative">
        <div className="text-center mb-10">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="section-title"
          >
            انواع روش دم‌آوری
          </motion.h2>
          <p className="section-subtitle">هر روش، دنیایی متفاوت از طعم و تجربه</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduce ? undefined : { y: -4 }}
                onMouseMove={trackPointer}
                className={`${glass} group relative overflow-hidden rounded-3xl p-6 md:p-8
                  hover:border-coffee-400/40 dark:hover:border-coffee-400/25 transition-all duration-300`}
              >
                {/* spotlight */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(200px circle at var(--x, 50%) var(--y, 50%), rgba(190,112,64,0.16), transparent 70%)",
                  }}
                />

                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur-md mb-5
                    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] ${t.tile}
                    transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={26} strokeWidth={1.5} />
                </div>

                <h3
                  className="relative text-xl font-bold mb-2 text-foreground/95"
                  style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                >
                  {t.name}
                </h3>
                <p className="relative text-sm leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-11">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-medium
              bg-gradient-to-b from-coffee-400 to-coffee-600
              shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_10px_28px_-10px_rgba(190,112,64,0.65)]
              hover:from-coffee-300 hover:to-coffee-500 hover:-translate-y-0.5
              transition-all duration-300"
          >
            مشاهده همه محصولات
            <ArrowLeft size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}