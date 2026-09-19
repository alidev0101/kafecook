"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "border rounded-2xl overflow-hidden transition-all duration-200",
                openIndex === i
                  ? "border-coffee-300 dark:border-coffee-700 shadow-warm"
                  : "border-border"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={17} className={openIndex === i ? "text-coffee-600 dark:text-coffee-400" : "text-muted-foreground"} />
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
          <Link href="/faq" className="text-sm text-coffee-600 dark:text-coffee-400 hover:underline font-medium">
            مشاهده همه سوالات متداول
          </Link>
        </div>
      </div>
    </section>
  );
}
