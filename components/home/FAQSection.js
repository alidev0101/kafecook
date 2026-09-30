"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "آیا قهوه‌های شما تازه رست شده هستند؟",    a: "بله، تمام قهوه‌های کافه کوک به صورت سفارشی رست می‌شوند و در کمترین زمان ممکن به دست شما می‌رسند." },
  { q: "مدت زمان ارسال چقدر است؟",                 a: "ارسال عادی ۳ تا ۵ روز کاری. اکسپرس ۱ تا ۲ روز. کرمان: همان روز با پیک." },
  { q: "آیا آسیاب قهوه هم انجام می‌دهید؟",         a: "بله، هنگام سفارش نوع آسیاب را انتخاب کنید. آسیاب بلافاصله قبل از ارسال انجام می‌شود." },
  { q: "امکان مرجوع کردن وجود دارد؟",             a: "تا ۷ روز پس از دریافت، در صورت آسیب فیزیکی یا عدم مطابقت با توضیحات امکان مرجوع وجود دارد." },
  { q: "حداقل مبلغ سفارش چقدر است؟",              a: "حداقل ۱۵۰ هزار تومان. برای سفارش‌های بالای ۵۰۰ هزار تومان ارسال رایگان است." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-background">
      {/* soft color behind the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-6 right-[16%] h-[300px] w-[300px] rounded-full bg-coffee-400/20 dark:bg-coffee-600/[0.14] blur-[110px]" />
        <div className="absolute bottom-0 left-[14%] h-[300px] w-[300px] rounded-full bg-amber-300/20 dark:bg-amber-700/[0.12] blur-[110px]" />
      </div>

      <div className="container-custom max-w-3xl relative">
        <div className="text-center mb-10">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="section-title"
          >
            سوالات متداول
          </motion.h2>
          <p className="section-subtitle">پاسخ به رایج‌ترین سوالات شما</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "glass rounded-2xl overflow-hidden transition-all duration-200",
                openIndex === i
                  ? "border-coffee-400/50 dark:border-coffee-400/30 shadow-[0_16px_36px_-16px_rgba(190,112,64,0.35)]"
                  : ""
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={17} className={openIndex === i ? "text-coffee-600 dark:text-coffee-300" : "text-muted-foreground"} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq" className="text-sm text-coffee-600 dark:text-coffee-300 hover:underline font-medium">
            مشاهده همه سوالات متداول
          </Link>
        </div>
      </div>
    </section>
  );
}
