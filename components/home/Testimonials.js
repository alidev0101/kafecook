import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  { name: "علی رضایی",    city: "کرمان",   rating: 5, text: "بهترین دان قهوه اتیوپی که تا حالا خریدم! عطر و طعمش فوق‌العاده‌ست.",  product: "اتیوپی یرگاچف", avatar: "ع" },
  { name: "فاطمه محمدی",  city: "تهران",   rating: 5, text: "کیفیت عالیه. پکیج‌بندی خیلی مرتبه. حتماً دوباره سفارش میدم.",        product: "بلند اسپرسو",    avatar: "ف" },
  { name: "سعید کرمانی",  city: "شیراز",   rating: 5, text: "چند ماهه مشتری کافه کوکم. هم کیفیت بالاست هم قیمت منصفانه.",         product: "کلمبیا سوپرمو",  avatar: "س" },
  { name: "مریم احمدی",   city: "اصفهان",  rating: 4, text: "قهوه فرنچ پرس که سفارش دادم خیلی خوب بود. دقیقاً همونی که خواستم.", product: "برزیل سانتوس",   avatar: "م" },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-muted/30 dark:bg-background">
      <div className="container-custom">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover flex flex-col gap-4 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className={j < r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"} />
                  ))}
                </div>
                <Quote size={16} className="text-muted-foreground opacity-40" />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{r.text}"</p>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-coffee-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
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
