import Link from "next/link";
import { motion } from "framer-motion";

const types = [
  { name: "اسپرسو",     desc: "غلیظ، شدید، با کرمای طلایی.",    icon: "☕", bg: "bg-coffee-800 dark:bg-coffee-900",      text: "text-white",     sub: "text-coffee-300" },
  { name: "فیلتر",      desc: "ظریف، معطر، با تمام لایه‌های طعم.", icon: "🫖", bg: "bg-amber-50 dark:bg-amber-950/40",     text: "text-gray-800 dark:text-gray-100", sub: "text-gray-500 dark:text-gray-400" },
  { name: "کولد برو",   desc: "دم‌آوری سرد ۱۲ تا ۲۴ ساعته.",    icon: "🧊", bg: "bg-sky-50 dark:bg-sky-950/40",        text: "text-gray-800 dark:text-gray-100", sub: "text-gray-500 dark:text-gray-400" },
  { name: "موکاپات",    desc: "قوی، با عمق و کاراکتر خاص.",      icon: "🫘", bg: "bg-coffee-100 dark:bg-coffee-900/40", text: "text-gray-800 dark:text-gray-100", sub: "text-gray-500 dark:text-gray-400" },
];

export default function CoffeeTypes() {
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
            انواع روش دم‌آوری
          </motion.h2>
          <p className="section-subtitle">هر روش، دنیایی متفاوت از طعم و تجربه</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${t.bg} rounded-3xl p-6 md:p-8 transition-all duration-300 hover:shadow-card-hover`}
            >
              <div className="text-5xl mb-4">{t.icon}</div>
              <h3 className={`text-xl font-bold mb-2 ${t.text}`} style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>{t.name}</h3>
              <p className={`text-sm leading-relaxed ${t.sub}`}>{t.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-coffee-600 hover:bg-coffee-700 dark:bg-coffee-500 dark:hover:bg-coffee-600 text-white font-medium rounded-2xl transition-all shadow-warm hover:shadow-warm-lg"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}
