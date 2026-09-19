import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "علی رضایی",
    city: "کرمان",
    rating: 5,
    text: "بهترین دان قهوه اتیوپی که تا حالا خریدم! عطر و طعمش فوق‌العاده‌ست. ارسال هم سریع بود.",
    product: "اتیوپی یرگاچف",
    avatar: "ع",
  },
  {
    name: "فاطمه محمدی",
    city: "تهران",
    rating: 5,
    text: "کیفیت قهوه‌هاشون واقعاً عالیه. پکیج‌بندی هم خیلی مرتبه. حتماً دوباره سفارش میدم.",
    product: "بلند اسپرسو",
    avatar: "ف",
  },
  {
    name: "سعید کرمانی",
    city: "شیراز",
    rating: 5,
    text: "چند ماهه مشتری کافه کوکم. هم کیفیت بالاست هم قیمتش منصفانه. پیشنهاد می‌کنم.",
    product: "کلمبیا سوپرمو",
    avatar: "س",
  },
  {
    name: "مریم احمدی",
    city: "اصفهان",
    rating: 4,
    text: "قهوه فرنچ پرس که سفارش دادم خیلی خوب بود. آسیاب دقیقاً همونی بود که خواستم.",
    product: "برزیل سانتوس",
    avatar: "م",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">مشتریان ما چه می‌گویند</h2>
          <p className="section-subtitle">نظر واقعی خریداران کافه کوک</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className={
                        j < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <Quote size={18} className="text-coffee-200" />
              </div>

              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                "{review.text}"
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-coffee-gradient flex items-center justify-center text-white font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.city} — {review.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
