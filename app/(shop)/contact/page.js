"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import PageHero from "@/components/shared/PageHero";

const contactInfo = [
  {
    icon: MapPin,
    label: "آدرس",
    value: "کرمان، خیابان شریعتی، پاساژ دانش، پلاک ۱۵",
  },
  {
    icon: Phone,
    label: "تلفن",
    value: "034-3245-6789",
    dir: "ltr",
  },
  {
    icon: Mail,
    label: "ایمیل",
    value: "info@kafecook.ir",
    dir: "ltr",
  },
  {
    icon: Clock3,
    label: "ساعات پاسخ‌گویی",
    value: "شنبه تا پنجشنبه، ۹ تا ۱۸",
  },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    toast.success("پیام شما با موفقیت ارسال شد. به زودی پاسخ می‌دهیم.");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <PageHero
        title="در ارتباط باشیم"
        subtitle="سوالی دارید؟ پیشنهاد یا انتقادی دارید؟ خوشحال می‌شویم صدای شما را بشنویم."
        breadcrumb={[{ label: "تماس با ما" }]}
      />

      {/* Main */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-coffee-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container-custom max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            {/* Contact info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-coffee-200/70 bg-coffee-50/70 px-3 py-1.5 text-xs font-medium text-coffee-700 dark:border-coffee-800/60 dark:bg-coffee-950/40 dark:text-coffee-300">
                  <MessageCircle size={14} />
                  راه‌های ارتباطی
                </div>

                <h2
                  className="text-2xl font-black text-foreground md:text-3xl"
                  style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                >
                  اطلاعات تماس
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  از طریق یکی از راه‌های زیر می‌توانید با کافه کوک در ارتباط
                  باشید.
                </p>
              </div>

              <div className="space-y-3">
                {contactInfo.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-coffee-300/60 hover:shadow-md dark:hover:border-coffee-700/60"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coffee-50 text-coffee-600 transition-transform duration-300 group-hover:scale-105 dark:bg-coffee-950/50 dark:text-coffee-300">
                        <Icon size={19} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-muted-foreground">
                          {item.label}
                        </p>

                        <p
                          className="break-words text-sm font-medium text-foreground"
                          dir={item.dir}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Support note */}
              <div className="mt-5 rounded-2xl border border-coffee-200/50 bg-coffee-50/50 p-4 dark:border-coffee-800/50 dark:bg-coffee-950/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coffee-100 text-coffee-700 dark:bg-coffee-900/50 dark:text-coffee-300">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      پاسخ‌گویی سریع
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      پیام‌های شما در ساعات کاری بررسی می‌شوند و در اولین فرصت
                      پاسخ خواهیم داد.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
                <div className="mb-7">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-coffee-50 text-coffee-600 dark:bg-coffee-950/50 dark:text-coffee-300">
                    <Send size={19} />
                  </div>

                  <h2
                    className="text-2xl font-black text-foreground"
                    style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                  >
                    ارسال پیام
                  </h2>

                  <p className="mt-1.5 text-sm text-muted-foreground">
                    فرم زیر را تکمیل کنید تا با شما در ارتباط باشیم.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        نام <span className="text-coffee-600">*</span>
                      </label>

                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="نام شما"
                        className="input-custom h-11 w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        ایمیل <span className="text-coffee-600">*</span>
                      </label>

                      <input
                        required
                        type="email"
                        dir="ltr"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="example@email.com"
                        className="input-custom h-11 w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      موضوع <span className="text-coffee-600">*</span>
                    </label>

                    <input
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      placeholder="موضوع پیام شما"
                      className="input-custom h-11 w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      پیام <span className="text-coffee-600">*</span>
                    </label>

                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="پیام خود را بنویسید..."
                      className="input-custom min-h-[140px] w-full resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    size="lg"
                    className="w-full"
                  >
                    <Send size={16} />
                    ارسال پیام
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pb-16 md:pb-20">
        <div className="container-custom max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-coffee-200/60 bg-gradient-to-br from-coffee-50 via-card to-amber-50/60 p-7 shadow-sm dark:border-coffee-800/50 dark:from-coffee-950/50 dark:via-card dark:to-amber-950/20 md:p-10">
            <div className="pointer-events-none absolute -left-16 -top-16 h-36 w-36 rounded-full bg-coffee-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-right">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coffee-100 text-coffee-700 dark:bg-coffee-900/50 dark:text-coffee-300">
                <Sparkles size={25} />
              </div>

              <div className="flex-1">
                <h3
                  className="text-xl font-black text-foreground"
                  style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
                >
                  حرف شما برای ما ارزشمند است
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  پیشنهادها، انتقادات و تجربه‌های شما به ما کمک می‌کنند هر روز
                  بهتر از قبل باشیم.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-coffee-700 dark:text-coffee-300">
                <CheckCircle2 size={16} />
                همراه شما هستیم
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}