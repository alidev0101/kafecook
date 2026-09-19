"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, ArrowLeft, Clock } from "lucide-react";

export default function SpecialOffers() {
  return (
    <section className="py-10 bg-muted/20 dark:bg-background">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Big banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-coffee-gradient p-8 md:p-10 text-white min-h-[220px] flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/5 translate-x-8 translate-y-8" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 text-xs font-medium mb-3">
                <Tag size={12} /> تخفیف ویژه
              </div>
              <h3
                className="text-2xl md:text-3xl font-black mb-2"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                تا ۴۰٪ تخفیف
                <br />روی قهوه‌های ویژه
              </h3>
              <p className="text-coffee-200 text-sm mb-5">فقط تا پایان این ماه</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-coffee-800 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-cream-100 transition-colors"
              >
                مشاهده پیشنهادها <ArrowLeft size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Two small banners */}
          <div className="grid grid-rows-2 gap-5">
            {[
              {
                badge: "محصول هفته",
                title: "اتیوپی یرگاچف",
                href: "/products",
                emoji: "🇪🇹",
                bg: "bg-amber-50 dark:bg-amber-950/30",
                border: "border-amber-100 dark:border-amber-900/40",
                badgeColor: "text-amber-600",
                linkColor: "text-amber-600 hover:text-amber-800 dark:text-amber-400",
              },
              {
                badge: "محدود",
                icon: Clock,
                title: "ست هدیه قهوه",
                href: "/products",
                emoji: "🎁",
                bg: "bg-emerald-50 dark:bg-emerald-950/30",
                border: "border-emerald-100 dark:border-emerald-900/40",
                badgeColor: "text-emerald-600",
                linkColor: "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400",
              },
            ].map(({ badge, icon: Icon, title, href, emoji, bg, border, badgeColor, linkColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-3xl border ${bg} ${border} p-6 flex items-center justify-between`}
              >
                <div>
                  <div className={`flex items-center gap-1.5 mb-1 text-xs font-medium ${badgeColor}`}>
                    {Icon && <Icon size={12} />} {badge}
                  </div>
                  <h4
                    className="text-xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                  >
                    {title}
                  </h4>
                  <Link href={href} className={`text-sm font-medium flex items-center gap-1 ${linkColor}`}>
                    سفارش بده <ArrowLeft size={13} />
                  </Link>
                </div>
                <div className="text-5xl">{emoji}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
