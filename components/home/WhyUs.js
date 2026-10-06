"use client";

import { ShieldCheck, Truck, RefreshCw, Headphones, Award, Leaf } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/* shared glass surface — same as the other sections */
const glass =
  "bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl " +
  "border border-white/80 dark:border-white/[0.08] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_12px_32px_-16px_rgba(90,50,20,0.22)] " +
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.65)]";

function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

const features = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت",
    desc: "محصولات ۱۰۰٪ اصل با تضمین کیفیت",
    tile: "bg-green-500/12 border-green-500/20 text-green-600 dark:text-green-400",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    desc: "ارسال به سراسر ایران در کمترین زمان",
    tile: "bg-blue-500/12 border-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    icon: RefreshCw,
    title: "۷ روز مرجوعی",
    desc: "بدون سوال پولتون رو برمی‌گردونیم",
    tile: "bg-purple-500/12 border-purple-500/20 text-purple-600 dark:text-purple-400",
  },
  {
    icon: Headphones,
    title: "پشتیبانی ۲۴/۷",
    desc: "هر سوالی داری، ما همیشه اینجاییم",
    tile: "bg-orange-500/12 border-orange-500/20 text-orange-600 dark:text-orange-400",
  },
  {
    icon: Award,
    title: "کیفیت برتر",
    desc: "انتخاب دقیق از بهترین مزارع جهان",
    tile: "bg-coffee-500/15 border-coffee-500/25 text-coffee-600 dark:text-coffee-300",
  },
  {
    icon: Leaf,
    title: "محصولات ارگانیک",
    desc: "قهوه‌های پایدار با رعایت محیط زیست",
    tile: "bg-emerald-500/12 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  },
];

export default function WhyUs() {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* soft color behind the glass */}
      <div aria-hidden className="pointer-events-none absolute">
        <div className="absolute -top-16 right-[8%] h-[340px] w-[340px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px]" />
        <div className="absolute -bottom-20 left-[10%] h-[320px] w-[320px] rounded-full bg-amber-300/20 dark:bg-amber-700/[0.12] blur-[110px]" />
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
            چرا کافه کوک؟
          </motion.h2>
          <p className="section-subtitle">مزایایی که ما را متفاوت می‌کند</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-3 lg:col-span-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduce ? undefined : { y: -3 }}
                  onMouseMove={trackPointer}
                  className={`${glass} group relative flex flex-col sm:flex-row items-start gap-3.5 overflow-hidden rounded-2xl p-4 md:p-5 max-h-max
                  hover:border-coffee-400/40 dark:hover:border-coffee-400/25 transition-all duration-300`}
                >
                  {/* spotlight */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(180px circle at var(--x, 50%) var(--y, 50%), rgba(190,112,64,0.14), transparent 70%)",
                    }}
                  />

                  <div
                    className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border backdrop-blur-md
                    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] ${f.tile}
                    transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="relative">
                    <h3 className="font-bold text-foreground/95 text-lg mb-1 line-clamp-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Image
            src={"/images/coffeeType.png"}
            width={500}
            height={500}
            className="h-[300px] w-[300px] mx-auto"
          />
        </div>

      </div>
    </section>
  );
}