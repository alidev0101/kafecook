import Link from "next/link";
import { Coffee, Instagram, Send, Phone, MapPin, Mail, Heart, ArrowLeft } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products",                  label: "همه محصولات" },
    { href: "/categories",                label: "دسته‌بندی‌ها" },
    { href: "/brands",                    label: "برندها" },
    { href: "/products?isNew=true",       label: "محصولات جدید" },
    { href: "/products?isBestSeller=true",label: "پرفروش‌ترین‌ها" },
  ],
  info: [
    { href: "/about",   label: "درباره کافه کوک" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/faq",     label: "سوالات متداول" },
    { href: "/blog",    label: "وبلاگ قهوه" },
  ],
  account: [
    { href: "/login",    label: "ورود به حساب" },
    { href: "/register", label: "ثبت‌نام" },
    { href: "/orders",   label: "سفارش‌هایم" },
    { href: "/wishlist", label: "علاقه‌مندی‌ها" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-coffee-950 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-coffee-800">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-xl font-black text-white mb-1"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                عضو خبرنامه کافه کوک شوید
              </h3>
              <p className="text-gray-400 text-sm">
                اولین نفری باشید که از تخفیف‌ها و محصولات جدید خبردار می‌شود
              </p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto min-w-[300px]"
              aria-label="فرم عضویت در خبرنامه"
            >
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                aria-label="ایمیل"
                className="flex-1 px-4 py-3 rounded-xl bg-coffee-900 border border-coffee-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-coffee-400 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-coffee-500 hover:bg-coffee-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                عضویت <ArrowLeft size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-coffee-500/20 border border-coffee-500/30 flex items-center justify-center group-hover:bg-coffee-500/30 transition-colors">
                <Coffee size={21} className="text-coffee-300" />
              </div>
              <span
                className="text-2xl font-black text-white"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                کافه کوک
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              کافه کوک، بهترین فروشگاه آنلاین قهوه تخصصی در کرمان. با اشتیاق
              بهترین دان‌های قهوه را از سراسر جهان انتخاب و به شما عرضه می‌کنیم.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://instagram.com/kafecook", icon: Instagram, label: "اینستاگرام" },
                { href: "https://t.me/kafecook",          icon: Send,      label: "تلگرام" },
                { href: "tel:+983412345678",              icon: Phone,     label: "تلفن" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-coffee-900 border border-coffee-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-coffee-500 hover:bg-coffee-800 transition-all"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "فروشگاه",     links: footerLinks.shop },
            { title: "اطلاعات",     links: footerLinks.info },
            { title: "حساب کاربری", links: footerLinks.account },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4
                className="text-white font-bold mb-4 text-sm"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-gray-400 hover:text-coffee-300 text-sm transition-colors hover:underline underline-offset-2"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info row */}
        <div className="mt-10 pt-8 border-t border-coffee-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, text: "کرمان، خیابان شریعتی، پاساژ دانش، پلاک ۱۵" },
            { icon: Phone,  text: "034-3245-6789", dir: "ltr" },
            { icon: Mail,   text: "info@kafecook.ir" },
          ].map(({ icon: Icon, text, dir }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-9 h-9 rounded-lg bg-coffee-900 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-coffee-400" />
              </div>
              <span dir={dir}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-coffee-800">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© ۱۴۰۳ کافه کوک — تمامی حقوق محفوظ است</p>
          <p className="flex items-center gap-1">
            ساخته شده با <Heart size={11} className="text-red-400 fill-red-400 mx-0.5" /> در کرمان
          </p>
        </div>
      </div>
    </footer>
  );
}
