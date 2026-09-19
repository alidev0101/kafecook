import { ShieldCheck, Truck, RefreshCw, Headphones, Award, Leaf } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت",
    desc: "تمام محصولات ما ۱۰۰٪ اصل و با تضمین کیفیت هستند",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    desc: "ارسال به سراسر ایران در کمترین زمان ممکن",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: RefreshCw,
    title: "۷ روز مرجوعی",
    desc: "اگر راضی نبودید، بدون سوال پولتون رو برمی‌گردونیم",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Headphones,
    title: "پشتیبانی ۲۴/۷",
    desc: "هر سوالی داری، ما همیشه اینجاییم",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Award,
    title: "کیفیت برتر",
    desc: "انتخاب دقیق بهترین دان‌ها از مزارع برتر جهان",
    color: "text-coffee-600 bg-coffee-50",
  },
  {
    icon: Leaf,
    title: "محصولات ارگانیک",
    desc: "قهوه‌های پایدار با رعایت محیط زیست",
    color: "text-emerald-600 bg-emerald-50",
  },
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">چرا کافه کوک؟</h2>
          <p className="section-subtitle">مزایایی که ما را متفاوت می‌کند</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-coffee-200 hover:shadow-card transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
