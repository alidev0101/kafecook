import { Coffee, Award, Users, MapPin, Star } from "lucide-react";

export const metadata = { title: "درباره ما | کافه کوک" };

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-coffee-gradient py-20 text-white text-center">
        <div className="container-custom max-w-3xl">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Coffee size={32} className="text-coffee-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">داستان ما</h1>
          <p className="text-coffee-200 text-lg leading-relaxed">
            کافه کوک از یک عشق ساده به قهوه شروع شد. از کرمان به ایران.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-5">
                از یک فنجان قهوه تا یک برند
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  کافه کوک در سال ۱۴۰۰ در قلب کرمان متولد شد. بنیانگذارانمان، دو دوست قدیمی
                  با عشق مشترک به قهوه، تصمیم گرفتند بهترین قهوه‌های جهان را به دست
                  ایرانیان برسانند.
                </p>
                <p>
                  ما مستقیماً از بهترین مزارع قهوه در اتیوپی، کلمبیا، برزیل و یمن
                  خرید می‌کنیم. هر دان قهوه‌ای که به دست شما می‌رسد، با دقت انتخاب
                  شده و تازه رست شده است.
                </p>
                <p>
                  امروز، با بیش از ۲۰۰۰ مشتری راضی در سراسر ایران، به مأموریت خود
                  ادامه می‌دهیم: تجربه‌ای جدید از قهوه به هر خانه ایرانی.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: "+۲۰۰۰", label: "مشتری راضی", color: "bg-blue-50 text-blue-600" },
                { icon: Coffee, value: "+۵۰", label: "واریته قهوه", color: "bg-coffee-50 text-coffee-600" },
                { icon: Award, value: "۳ سال", label: "تجربه", color: "bg-amber-50 text-amber-600" },
                { icon: MapPin, value: "کرمان", label: "مرکز فعالیت", color: "bg-green-50 text-green-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-card text-center">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon size={22} />
                  </div>
                  <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cream-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">ارزش‌های ما</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🌱", title: "پایداری", desc: "قهوه‌های ما از مزارع پایدار و اخلاقی تهیه می‌شود" },
              { icon: "✨", title: "کیفیت", desc: "هیچ محصولی بدون تأیید کیفیت از انبار ما خارج نمی‌شود" },
              { icon: "❤️", title: "عشق", desc: "هر سفارش با دقت و محبت بسته‌بندی می‌شود" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 text-center shadow-card">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
