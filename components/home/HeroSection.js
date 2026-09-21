"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Truck, Award } from "lucide-react";

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-hero-dark"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-950 via-coffee-900/90 to-coffee-800/80" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coffee-700/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-800/10 blur-[100px]" />
      </motion.div>

      <div className="container-custom relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Text Column ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="order-2 lg:order-1 text-right"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-coffee-800/60 backdrop-blur-sm border border-coffee-700/60 text-coffee-300 text-xs sm:text-sm px-4 py-2 rounded-full mb-6">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                بیش از ۵۰۰ محصول تخصصی قهوه
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.15] mb-6"
              style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
            >
              قهوه‌ای که{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-amber-400 via-coffee-300 to-amber-300">
                داستان دارد
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-coffee-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              کافه کوک، بهترین دان‌های قهوه را از بهترین مزارع جهان انتخاب
              می‌کند و با عشق به کرمان می‌آورد.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-coffee-500 hover:bg-coffee-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-warm-lg hover:shadow-glow hover:-translate-y-0.5 text-base"
              >
                خرید قهوه <ArrowLeft size={17} />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium rounded-2xl transition-all duration-300 text-base backdrop-blur-sm"
              >
                دسته‌بندی‌ها
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-5 text-coffee-400 text-sm">
              {[
                { icon: ShieldCheck, label: "ضمانت اصالت",    color: "text-green-400" },
                { icon: Truck,       label: "ارسال سریع",      color: "text-blue-400" },
                { icon: Award,       label: "+۲۰۰۰ مشتری راضی", color: "text-amber-400" },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon size={16} className={color} /> {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Image Column — ۳ جای تصویر ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-square">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-coffee-500/15 blur-3xl scale-110" />

              {/* ── تصویر اصلی مرکزی (تصویر ۱) ── */}
              <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-coffee-600/30 bg-coffee-900/40 backdrop-blur-sm shadow-[0_0_60px_rgba(190,112,64,0.2)]">
                {/* ← تصویر اصلی را اینجا قرار دهید: /images/hero-main.jpg */}
                <Image
                  src="/images/imageshero-main.jpg"
                  alt="قهوه تخصصی کافه کوک"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                {/* Placeholder تا زمانی که تصویر قرار داده نشده */}
                <div className="w-full h-full flex items-center justify-center text-[100px] select-none opacity-30">
                  ☕
                </div>
              </div>

              {/* ── تصویر سمت راست (تصویر ۲) ── */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-1/4 w-24 h-24 rounded-2xl overflow-hidden border-2 border-coffee-600/30 shadow-warm-lg bg-coffee-900/60 backdrop-blur-sm"
              >
                {/* ← تصویر محصول ۱ را اینجا قرار دهید: /images/hero-product-1.jpg */}
                <Image
                  src="/images/hero-product-1.jpg"
                  alt="محصول ویژه"
                  fill
                  className="object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-40">🫘</div>
              </motion.div>

              {/* ── تصویر سمت چپ (تصویر ۳) ── */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-6 bottom-1/4 w-20 h-20 rounded-2xl overflow-hidden border-2 border-coffee-600/30 shadow-warm-lg bg-coffee-900/60 backdrop-blur-sm"
              >
                {/* ← تصویر محصول ۲ را اینجا قرار دهید: /images/hero-product-2.jpg */}
                <Image
                  src="/images/hero-product-2.jpg"
                  alt="قهوه تازه"
                  fill
                  className="object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-40">🌱</div>
              </motion.div>

              {/* Floating info card — بالا چپ */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-2 left-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 text-white text-xs shadow-lg"
              >
                <p className="font-black text-amber-400 text-sm">۱۰۰٪</p>
                <p className="text-coffee-200">ارگانیک</p>
              </motion.div>

              {/* Floating info card — پایین راست */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 right-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 text-white text-xs shadow-lg"
              >
                <p className="font-black text-green-400 text-sm">+۵۰</p>
                <p className="text-coffee-200">واریته</p>
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
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-coffee-600 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-coffee-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
