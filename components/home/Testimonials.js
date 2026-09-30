"use client";

import { Star, Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const reviews = [
  { name: "علی رضایی",    city: "کرمان",   rating: 5, text: "بهترین دان قهوه اتیوپی که تا حالا خریدم! عطر و طعمش فوق‌العاده‌ست.",  product: "اتیوپی یرگاچف", avatar: "ع" },
  { name: "فاطمه محمدی",  city: "تهران",   rating: 5, text: "کیفیت عالیه. پکیج‌بندی خیلی مرتبه. حتماً دوباره سفارش میدم.",        product: "بلند اسپرسو",    avatar: "ف" },
  { name: "سعید کرمانی",  city: "شیراز",   rating: 5, text: "چند ماهه مشتری کافه کوکم. هم کیفیت بالاست هم قیمت منصفانه.",         product: "کلمبیا سوپرمو",  avatar: "س" },
  { name: "مریم احمدی",   city: "اصفهان",  rating: 4, text: "قهوه فرنچ پرس که سفارش دادم خیلی خوب بود. دقیقاً همونی که خواستم.", product: "برزیل سانتوس",   avatar: "م" },
];

export default function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-muted/20 dark:bg-background">
      {/* soft color behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-[10%] h-[340px] w-[340px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px]" />
        <div className="absolute -bottom-16 right-[8%] h-[320px] w-[320px] rounded-full bg-amber-300/20 dark:bg-amber-700/[0.12] blur-[110px]" />
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
            مشتریان ما چه می‌گویند
          </motion.h2>
          <p className="section-subtitle">نظر واقعی خریداران کافه کوک</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { y: -4 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
              }}
              className="glass group relative flex flex-col gap-4 rounded-3xl p-5 overflow-hidden
                hover:border-coffee-400/40 dark:hover:border-coffee-400/25 transition-all duration-300"
            >
              {/* spotlight */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(200px circle at var(--x, 50%) var(--y, 50%), rgba(190,112,64,0.14), transparent 70%)",
                }}
              />

              <div className="relative flex items-start justify-between">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className={j < r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"} />
                  ))}
                </div>
                <Quote size={16} className="text-muted-foreground opacity-40" />
              </div>

              <p className="relative text-sm text-muted-foreground leading-relaxed flex-1">"{r.text}"</p>

              <div className="relative flex items-center gap-3 pt-3 border-t border-black/[0.06] dark:border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-b from-coffee-400 to-coffee-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]">
                  {r.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.city} — {r.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
