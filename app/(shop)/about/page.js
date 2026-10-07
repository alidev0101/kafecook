import PageHero from "@/components/shared/PageHero";
import {
  Award,
  CheckCircle2,
  Coffee,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "درباره ما | کافه کوک" };

const stats = [
  {
    icon: Users,
    value: "+۲۰۰۰",
    label: "مشتری راضی",
  },
  {
    icon: Coffee,
    value: "+۵۰",
    label: "واریته قهوه",
  },
  {
    icon: Award,
    value: "۳ سال",
    label: "تجربه",
  },
  {
    icon: MapPin,
    value: "کرمان",
    label: "مرکز فعالیت",
  },
];

const values = [
  {
    icon: Leaf,
    title: "پایداری",
    desc: "قهوه‌های ما با توجه به اصول کشاورزی پایدار و تأمین مسئولانه انتخاب می‌شوند.",
  },
  {
    icon: ShieldCheck,
    title: "کیفیت",
    desc: "هر محصول پیش از رسیدن به دست شما با دقت بررسی و تأیید کیفیت می‌شود.",
  },
  {
    icon: Heart,
    title: "عشق",
    desc: "از انتخاب دانه تا بسته‌بندی نهایی، هر سفارش با دقت و علاقه آماده می‌شود.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <PageHero
        title="داستان ما"
        subtitle="کافه کوک از یک عشق ساده به قهوه شروع شد؛ از کرمان به سراسر ایران."
        breadcrumb={[{ label: "درباره ما" }]}
      />

      {/* Story */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-coffee-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container-custom max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Story content */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-coffee-200/70 bg-coffee-50/70 px-3 py-1.5 text-xs font-medium text-coffee-700 dark:border-coffee-800/60 dark:bg-coffee-950/40 dark:text-coffee-300">
                <Coffee size={14} />
                داستان کافه کوک
              </div>

              <h2
                className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                از یک فنجان قهوه
                <span className="text-coffee-600 dark:text-coffee-400"> تا یک برند</span>
              </h2>

              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  کافه کوک در سال ۱۴۰۰ در قلب کرمان متولد شد. بنیانگذارانمان،
                  دو دوست قدیمی با عشق مشترک به قهوه، تصمیم گرفتند تجربه‌ای
                  متفاوت از قهوه را با ایرانیان به اشتراک بگذارند.
                </p>

                <p>
                  ما قهوه‌های منتخب را از مزارع معتبر در اتیوپی، کلمبیا،
                  برزیل و یمن تهیه می‌کنیم. هر دان قهوه با دقت انتخاب،
                  رست و آماده می‌شود تا تازگی و کیفیت آن حفظ شود.
                </p>

                <p>
                  امروز، با جامعه‌ای از مشتریان قهوه‌دوست در سراسر ایران،
                  همچنان همان مسیر را ادامه می‌دهیم؛ ساختن تجربه‌ای ساده،
                  باکیفیت و دوست‌داشتنی برای هر فنجان قهوه.
                </p>
              </div>

              <div className="mt-7 flex items-center gap-2 text-sm font-medium text-coffee-700 dark:text-coffee-300">
                <CheckCircle2 size={17} />
                کیفیت، تازگی و تجربه‌ای متفاوت
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-border/60 bg-card/80 p-5 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-coffee-300/60 hover:shadow-lg hover:shadow-coffee-900/5 dark:hover:border-coffee-700/60"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coffee-50 text-coffee-600 transition-transform duration-300 group-hover:scale-105 dark:bg-coffee-950/50 dark:text-coffee-300">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <p className="text-2xl font-black text-foreground">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-coffee-500/[0.02] via-transparent to-amber-500/[0.02]" />

        <div className="container-custom max-w-5xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-coffee-100 text-coffee-700 dark:bg-coffee-950/60 dark:text-coffee-300">
              <Sparkles size={20} />
            </div>

            <h2
              className="text-2xl font-black text-foreground md:text-3xl"
              style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
            >
              ارزش‌های ما
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              چیزهایی که در تمام مسیر کافه کوک برای ما اهمیت دارند.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-coffee-300/60 hover:shadow-lg hover:shadow-coffee-900/5 dark:hover:border-coffee-700/60"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-coffee-50 text-coffee-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-coffee-100 dark:bg-coffee-950/50 dark:text-coffee-300 dark:group-hover:bg-coffee-900/60">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>

                  <h3
                    className="mb-2 font-bold text-foreground"
                    style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                  >
                    {value.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 md:py-20">
        <div className="container-custom max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-coffee-200/60 bg-gradient-to-br from-coffee-50 via-card to-amber-50/60 p-8 text-center shadow-sm dark:border-coffee-800/50 dark:from-coffee-950/50 dark:via-card dark:to-amber-950/20 md:p-12">
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-coffee-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative">
              <Link
                href="/"
                className="mb-8 flex items-center justify-center gap-2"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_8px_18px_-8px_rgba(190,112,64,0.7)] transition-shadow">
                  <Image
                    src="/icons/icon-72x72.png"
                    alt="کافه کوک"
                    width={45}
                    height={45}
                  />
                </div>
              </Link>

              <h2
                className="text-2xl font-black text-foreground md:text-3xl"
                style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
              >
                قهوه خوب، شروع یک لحظه خوب است
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                ما در کافه کوک تلاش می‌کنیم این لحظه را با قهوه‌ای تازه،
                باکیفیت و انتخابی دقیق برای شما بسازیم.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}