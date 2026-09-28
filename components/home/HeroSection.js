"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Truck, Award } from "lucide-react";

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

/* ── shared glass surface: hairline border + top inner highlight + soft depth ── */
const glass =
  "bg-white/[0.05] backdrop-blur-xl border border-white/[0.09] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10),0_24px_48px_-24px_rgba(0,0,0,0.65)]";

export default function HeroSection() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const float = (from, to, duration, delay = 0) =>
    reduce
      ? {}
      : {
          animate: { y: [0, from, to, 0] },
          transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
        };

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-hero-dark"
    >
      {/* ── Background: parallax gradient + soft orbs ── */}
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-950 via-coffee-900/95 to-coffee-800/70" />
        <div className="absolute -top-24 -right-24 w-[620px] h-[620px] rounded-full bg-coffee-600/[0.14] blur-[120px]" />
        <div className="absolute -bottom-32 -left-24 w-[520px] h-[520px] rounded-full bg-amber-700/[0.12] blur-[120px]" />
      </motion.div>

      {/* Fine dot grid, faded at edges */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 pointer-events-none
          [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)]
          [background-size:28px_28px]
          [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
      />

      {/* Bottom hairline */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent"
      />

      <div className="container-custom relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Text Column ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="order-2 lg:order-1 text-right"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span
                className={`${glass} inline-flex items-center gap-2 text-coffee-200 text-xs sm:text-[13px] px-4 py-2 rounded-full mb-7`}
              >
                <Star size={12} className="fill-amber-300 text-amber-300" />
                بیش از ۵۰۰ محصول تخصصی قهوه
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black text-white/95 leading-[1.2] tracking-tight mb-6"
              style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
            >
              قهوه‌ای که{" "}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-coffee-200 to-amber-400">
                داستان دارد
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-coffee-300/85 text-base sm:text-[17px] leading-loose mb-9 max-w-md"
            >
              کافه کوک، بهترین دان‌های قهوه را از بهترین مزارع جهان انتخاب
              می‌کند و با عشق به کرمان می‌آورد.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-bold text-white
                  bg-gradient-to-b from-coffee-400 to-coffee-500
                  shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_10px_30px_-10px_rgba(190,112,64,0.65)]
                  hover:from-coffee-300 hover:to-coffee-400 hover:-translate-y-0.5
                  transition-all duration-300"
              >
                خرید قهوه
                <ArrowLeft size={17} className="transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/categories"
                className={`${glass} inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium text-white/90
                  hover:bg-white/[0.10] hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300`}
              >
                دسته‌بندی‌ها
              </Link>
            </motion.div>

            {/* Trust strip — one glass bar, monochrome icons */}
            <motion.div variants={fadeUp}>
              <div
                className={`${glass} inline-flex flex-wrap items-stretch rounded-2xl divide-x divide-x-reverse divide-white/10 text-coffee-300 text-[13px]`}
              >
                {[
                  { icon: ShieldCheck, label: "ضمانت اصالت" },
                  { icon: Truck,       label: "ارسال سریع" },
                  { icon: Award,       label: "+۲۰۰۰ مشتری راضی" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-2 px-4 py-2.5">
                    <Icon size={15} className="text-amber-200/80" strokeWidth={1.75} />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Image Column — ۳ جای تصویر ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-square">
              {/* Ambient glow */}
              <div className="absolute inset-0 rounded-full bg-coffee-500/[0.16] blur-3xl scale-110" />

              {/* Orbit hairlines */}
              <div aria-hidden className="absolute -inset-5 rounded-full border border-white/[0.05]" />
              <div aria-hidden className="absolute inset-0 rounded-full border border-white/[0.08]" />

              {/* ── تصویر اصلی مرکزی (تصویر ۱) — glass frame ── */}
              <div className={`${glass} absolute inset-8 rounded-full p-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_0_70px_-10px_rgba(190,112,64,0.35)]`}>
                <div className="relative w-full h-full rounded-full overflow-hidden bg-coffee-900/50">
                  {/* ← تصویر اصلی را اینجا قرار دهید: /images/hero-main.jpg */}
                  <Image
                    src="/images/hero-main.jpg"
                    alt="قهوه تخصصی کافه کوک"
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  {/* Placeholder تا زمانی که تصویر قرار داده نشده */}
                  <div className="w-full h-full flex items-center justify-center text-[96px] select-none opacity-25">
                    ☕
                  </div>
                  {/* Soft inner sheen */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.10] via-transparent to-black/25" />
                </div>
              </div>

              {/* ── تصویر سمت راست (تصویر ۲) ── */}
              <motion.div
                {...float(-8, -8, 3.5)}
                className={`${glass} absolute -right-6 top-1/4 w-24 h-24 rounded-3xl p-1.5`}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-coffee-900/60">
                  {/* ← تصویر محصول ۱ را اینجا قرار دهید: /images/hero-product-1.jpg */}
                  <Image
                    src="/images/hero-product-1.jpg"
                    alt="محصول ویژه"
                    fill
                    className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-35">🫘</div>
                </div>
              </motion.div>

              {/* ── تصویر سمت چپ (تصویر ۳) ── */}
              <motion.div
                {...float(8, 8, 4, 0.5)}
                className={`${glass} absolute -left-6 bottom-1/4 w-20 h-20 rounded-3xl p-1.5`}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-coffee-900/60">
                  {/* ← تصویر محصول ۲ را اینجا قرار دهید: /images/hero-product-2.jpg */}
                  <Image
                    src="/images/hero-product-2.jpg"
                    alt="قهوه تازه"
                    fill
                    className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-35">🌱</div>
                </div>
              </motion.div>

              {/* Floating info card — بالا چپ */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`${glass} absolute top-2 left-2 rounded-2xl px-3.5 py-2.5 text-white text-xs`}
              >
                <p className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-400">۱۰۰٪</p>
                <p className="text-coffee-200/90 mt-0.5">ارگانیک</p>
              </motion.div>

              {/* Floating info card — پایین راست */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className={`${glass} absolute bottom-4 right-2 rounded-2xl px-3.5 py-2.5 text-white text-xs`}
              >
                <p className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-400">+۵۰</p>
                <p className="text-coffee-200/90 mt-0.5">واریته</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <motion.div
          {...(reduce ? {} : { animate: { y: [0, 5, 0] }, transition: { duration: 1.6, repeat: Infinity } })}
          className="w-5 h-8 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm flex items-start justify-center p-1"
        >
          <div className="w-0.5 h-2 rounded-full bg-coffee-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}