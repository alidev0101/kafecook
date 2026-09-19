"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const faqs = [
  {
    q: "آیا قهوه‌های شما تازه رست شده هستند؟",
    a: "بله، تمام قهوه‌های کافه کوک به صورت سفارشی رست می‌شوند و در کمترین زمان ممکن به دست شما می‌رسند تا تازگی و کیفیت آن‌ها حفظ شود.",
  },
  {
    q: "مدت زمان ارسال چقدر است؟",
    a: "ارسال عادی ۳ تا ۵ روز کاری و ارسال اکسپرس ۱ تا ۲ روز کاری. برای شهر کرمان، ارسال پیک موتوری در همان روز امکان‌پذیر است.",
  },
  {
    q: "آیا آسیاب قهوه هم انجام می‌دهید؟",
    a: "بله، هنگام سفارش می‌توانید نوع آسیاب (ریز، متوسط، درشت، اسپرسو یا دان کامل) را انتخاب کنید. آسیاب بلافاصله قبل از بسته‌بندی انجام می‌شود.",
  },
  {
    q: "امکان مرجوع کردن محصول وجود دارد؟",
    a: "در صورت نارضایتی از محصول، تا ۷ روز پس از دریافت امکان مرجوع کردن وجود دارد. فقط محصول باید آسیب فیزیکی نداشته باشد.",
  },
  {
    q: "حداقل مبلغ سفارش چقدر است؟",
    a: "حداقل مبلغ سفارش ۱۵۰ هزار تومان است. برای سفارش‌های بالای ۵۰۰ هزار تومان، ارسال رایگان است.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="section-title">سوالات متداول</h2>
          <p className="section-subtitle">پاسخ به رایج‌ترین سوالات شما</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "border rounded-2xl overflow-hidden transition-all duration-200",
                openIndex === i ? "border-coffee-300 shadow-warm" : "border-gray-200"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right"
              >
                <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp size={18} className="text-coffee-600 flex-shrink-0 mr-3" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mr-3" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq" className="text-sm text-coffee-600 hover:underline font-medium">
            مشاهده همه سوالات متداول
          </Link>
        </div>
      </div>
    </section>
  );
}
