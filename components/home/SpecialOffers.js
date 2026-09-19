import Link from "next/link";
import { Tag, ArrowLeft, Clock } from "lucide-react";

export default function SpecialOffers() {
  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Big banner */}
          <div className="relative rounded-3xl overflow-hidden bg-coffee-gradient p-8 md:p-10 text-white min-h-[220px] flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/5 translate-x-8 translate-y-8" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 text-xs font-medium mb-3">
                <Tag size={12} />
                تخفیف ویژه
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-2">
                تا ۴۰٪ تخفیف
                <br />
                روی قهوه‌های ویژه
              </h3>
              <p className="text-coffee-200 text-sm mb-5">فقط تا پایان این ماه</p>
              <Link
                href="/products?sort=price-asc"
                className="inline-flex items-center gap-2 bg-white text-coffee-800 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-cream-100 transition-colors"
              >
                مشاهده پیشنهادها <ArrowLeft size={15} />
              </Link>
            </div>
          </div>

          {/* Two small banners */}
          <div className="grid grid-rows-2 gap-5">
            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600 mb-1">محصول هفته</p>
                <h4 className="text-xl font-bold text-gray-800 mb-2">اتیوپی یرگاچف</h4>
                <Link
                  href="/products"
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
                >
                  خرید کن <ArrowLeft size={13} />
                </Link>
              </div>
              <div className="text-5xl">🇪🇹</div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={12} className="text-emerald-600" />
                  <p className="text-xs font-medium text-emerald-600">محدود</p>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">ست هدیه قهوه</h4>
                <Link
                  href="/products"
                  className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
                >
                  سفارش بده <ArrowLeft size={13} />
                </Link>
              </div>
              <div className="text-5xl">🎁</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
