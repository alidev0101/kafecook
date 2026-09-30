import Link from "next/link";
import { Coffee, Instagram, Send, Phone, MapPin, Mail, ArrowLeft } from "lucide-react";

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
    <footer className="relative mt-10 bg-coffee-950/90 dark:bg-coffee-950 text-coffee-200/80 backdrop-blur-2xl border-t border-white/10">
      {/* ambient orbs inside footer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-[12%] h-72 w-72 rounded-full bg-coffee-600/20 blur-[110px]" />
        <div className="absolute -bottom-28 left-[8%] h-72 w-72 rounded-full bg-amber-700/15 blur-[110px]" />
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/[0.08] relative">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-morabba text-xl font-black text-white mb-1">
                عضو خبرنامه کافه کوک شوید
              </h3>
              <p className="text-coffee-300/70 text-sm">
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
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-coffee-300/40 text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400/40 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-b from-coffee-400 to-coffee-600 hover:from-coffee-300 hover:to-coffee-500 text-white rounded-xl text-sm font-medium transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_8px_20px_-8px_rgba(190,112,64,0.7)] flex items-center gap-2"
              >
                عضویت <ArrowLeft size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-custom py-12 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                <Coffee size={21} className="text-coffee-300" />
              </div>
              <span className="font-morabba text-2xl font-black text-white">
                کافه کوک
              </span>
            </Link>
            <p className="text-coffee-300/70 text-sm leading-relaxed mb-6 max-w-xs">
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
                  className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center justify-center text-coffee-300/70 hover:text-white hover:border-coffee-400/40 hover:bg-coffee-600/30 transition-all"
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
              <h4 className="font-morabba text-white font-bold mb-4 text-sm">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-coffee-300/60 hover:text-coffee-200 text-sm transition-colors hover:underline underline-offset-4 decoration-coffee-500/40"
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
        <div className="mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, text: "کرمان، خیابان شریعتی، پاساژ دانش، پلاک ۱۵" },
            { icon: Phone,  text: "034-3245-6789", dir: "ltr" },
            { icon: Mail,   text: "info@kafecook.ir" },
          ].map(({ icon: Icon, text, dir }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-coffee-300/60">
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-coffee-400" />
              </div>
              <span dir={dir}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08] relative">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-coffee-300/40">
          <p>© ۱۴۰۳ کافه کوک — تمامی حقوق محفوظ است</p>
          <p className="flex items-center gap-1">
            نسخه : 1.0.1
          </p>
        </div>
      </div>
    </footer>
  );
}
