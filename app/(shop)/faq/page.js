"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [openItem, setOpenItem] = useState(null);

  return (
    <div className="bg-background">
      <div className="bg-coffee-gradient py-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl font-black mb-3">سوالات متداول</h1>
          <p className="text-coffee-200">پاسخ سوالات رایج درباره کافه کوک</p>
        </div>
      </div>

      <div className="container-custom py-16 max-w-3xl">
        {faqs.map((section) => (
          <div key={section.category} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = openItem === key;
                return (
                  <div key={i} className={cn("border rounded-2xl overflow-hidden transition-all", isOpen ? "border-coffee-300 shadow-warm" : "border-gray-200")}>
                    <button
                      onClick={() => setOpenItem(isOpen ? null : key)}
                      className="w-full flex items-center justify-between p-5 text-right"
                    >
                      <span className="font-semibold text-gray-800 text-sm">{item.q}</span>
                      {isOpen ? <ChevronUp size={16} className="text-coffee-600 flex-shrink-0 mr-3" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mr-3" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
