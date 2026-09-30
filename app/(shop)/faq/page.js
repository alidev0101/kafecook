"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "سفارش و خرید",
    items: [
      { q: "آیا قهوه‌های شما تازه رست شده هستند؟", a: "بله، تمام قهوه‌های کافه کوک به صورت سفارشی رست می‌شوند و حداکثر ۲ هفته پس از رست به دست شما می‌رسند." },
      { q: "حداقل مبلغ سفارش چقدر است؟", a: "حداقل مبلغ سفارش ۱۵۰,۰۰۰ تومان است. برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان ارسال رایگان است." },
      { q: "آیا می‌توانم سفارشم را ویرایش یا لغو کنم؟", a: "تا قبل از تأیید سفارش توسط ما، امکان لغو وجود دارد. پس از آن با تیم پشتیبانی تماس بگیرید." },
    ],
  },
  {
    category: "محصولات",
    items: [
      { q: "آیا آسیاب قهوه هم انجام می‌دهید؟", a: "بله، هنگام سفارش نوع آسیاب (ریز، متوسط، درشت، اسپرسو یا دان کامل) را انتخاب کنید." },
      { q: "قهوه‌های شما از کجا تهیه می‌شوند؟", a: "ما مستقیماً از مزارع منتخب اتیوپی، کلمبیا، برزیل، یمن و کستاریکا تهیه می‌کنیم." },
      { q: "نگهداری قهوه را چگونه توصیه می‌کنید؟", a: "در ظرف درب‌دار، دور از نور مستقیم، رطوبت و حرارت بالا نگهداری کنید. از قرار دادن در فریزر خودداری کنید." },
    ],
  },
  {
    category: "ارسال و تحویل",
    items: [
      { q: "مدت زمان ارسال چقدر است؟", a: "ارسال عادی ۳-۵ روز کاری، اکسپرس ۱-۲ روز کاری. کرمان: همان روز با پیک." },
      { q: "هزینه ارسال چقدر است؟", a: "ارسال عادی ۳۵,۰۰۰ تومان، اکسپرس ۷۰,۰۰۰ تومان. برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان رایگان." },
      { q: "آیا به خارج از ایران ارسال می‌کنید؟", a: "در حال حاضر فقط داخل ایران ارسال داریم." },
    ],
  },
  {
    category: "پرداخت و مرجوعی",
    items: [
      { q: "روش‌های پرداخت چیست؟", a: "پرداخت آنلاین با کارت بانکی یا پرداخت در محل (COD) برای شهر کرمان." },
      { q: "امکان مرجوع کردن وجود دارد؟", a: "بله، تا ۷ روز پس از دریافت، در صورت آسیب فیزیکی یا عدم مطابقت با توضیحات، قابل مرجوع است." },
    ],
  },
];

export default function FAQPage() {
    const reduce = useReducedMotion();
  const [openItem, setOpenItem] = useState(null);

  return (
    <div className="bg-background">
      <div className="bg-coffee-gradient py-16 text-white text-center pt-24">
        <div className="container-custom">
          <h1 className="text-4xl font-black mb-3 moraba">سوالات متداول</h1>
          <p className="text-coffee-200">پاسخ سوالات رایج درباره کافه کوک</p>
        </div>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto mt-20 px-2">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-coffee-500 dark:text-coffee-300 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 moraba">
              {section.category}
            </h2>

            <div className="space-y-3">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = openItem === key;

                return (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className={cn("glass rounded-2xl overflow-hidden transition-all duration-200", isOpen ? "border-coffee-400/50 dark:border-coffee-400/30 shadow-[0_16px_36px_-16px_rgba(190,112,64,0.35)]" : "")}
                  >
                    <button
                      onClick={() => setOpenItem(isOpen ? null : key)}
                      className="w-full flex items-center justify-between p-5 text-right"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-foreground text-sm">{item.q}</span>

                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={17} className={isOpen ? "text-coffee-600 dark:text-coffee-300" : "text-muted-foreground"} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
