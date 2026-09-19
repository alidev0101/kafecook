"use client";

import { ShieldCheck, Truck, RefreshCw, Headphones, Award, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: ShieldCheck, title: "ضمانت اصالت",   desc: "تمام محصولات ۱۰۰٪ اصل با تضمین کیفیت", color: "bg-green-100  dark:bg-green-900/20  text-green-600  dark:text-green-400"  },
  { icon: Truck,       title: "ارسال سریع",     desc: "ارسال به سراسر ایران در کمترین زمان",   color: "bg-blue-100   dark:bg-blue-900/20   text-blue-600   dark:text-blue-400"   },
  { icon: RefreshCw,   title: "۷ روز مرجوعی",  desc: "بدون سوال پولتون رو برمی‌گردونیم",      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  { icon: Headphones,  title: "پشتیبانی ۲۴/۷", desc: "هر سوالی داری، ما همیشه اینجاییم",     color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" },
  { icon: Award,       title: "کیفیت برتر",    desc: "انتخاب دقیق از بهترین مزارع جهان",      color: "bg-coffee-100 dark:bg-coffee-900/20 text-coffee-600 dark:text-coffee-400" },
  { icon: Leaf,        title: "محصولات ارگانیک", desc: "قهوه‌های پایدار با رعایت محیط زیست", color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container-custom">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            چرا کافه کوک؟
          </motion.h2>
          <p className="section-subtitle">مزایایی که ما را متفاوت می‌کند</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="flex flex-col sm:flex-row items-start gap-3.5 p-4 md:p-5 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
