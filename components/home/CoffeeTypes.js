import Link from "next/link";

const types = [
  {
    name: "اسپرسو",
    description: "غلیظ، شدید، با کرمای طلایی. پایه اکثر نوشیدنی‌های قهوه.",
    icon: "☕",
    color: "bg-coffee-800",
    textColor: "text-white",
  },
  {
    name: "فیلتر",
    description: "ظریف، معطر، با تمام لایه‌های طعم. برای لذت آهسته.",
    icon: "🫖",
    color: "bg-amber-50",
    textColor: "text-gray-800",
  },
  {
    name: "کولد برو",
    description: "دم‌آوری سرد ۱۲ تا ۲۴ ساعته. تازه، شیرین، بدون تلخی.",
    icon: "🧊",
    color: "bg-sky-50",
    textColor: "text-gray-800",
  },
  {
    name: "موکاپات",
    description: "قوی مثل اسپرسو، با عمق و کاراکتر خاص خودش.",
    icon: "🫘",
    color: "bg-coffee-100",
    textColor: "text-gray-800",
  },
];

export default function CoffeeTypes() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">انواع روش دم‌آوری</h2>
          <p className="section-subtitle mt-2">هر روش، دنیایی متفاوت از طعم و تجربه</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((type) => (
            <div
              key={type.name}
              className={`${type.color} ${type.textColor} rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
            >
              <div className="text-5xl mb-4">{type.icon}</div>
              <h3 className="text-xl font-bold mb-2">{type.name}</h3>
              <p
                className={`text-sm leading-relaxed ${
                  type.textColor === "text-white" ? "text-coffee-300" : "text-gray-500"
                }`}
              >
                {type.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-coffee-600 hover:bg-coffee-700 text-white font-medium rounded-2xl transition-all shadow-warm hover:shadow-warm-lg"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}
