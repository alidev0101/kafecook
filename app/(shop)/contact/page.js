"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("پیام شما با موفقیت ارسال شد. به زودی پاسخ می‌دهیم.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="bg-coffee-gradient py-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl font-black mb-3">تماس با ما</h1>
          <p className="text-coffee-200">در خدمت شما هستیم</p>
        </div>
      </div>

      <div className="container-custom py-16 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-gray-800 mb-6">اطلاعات تماس</h2>
            {[
              { icon: MapPin, label: "آدرس", value: "کرمان، خیابان شریعتی، پاساژ دانش، پلاک ۱۵", color: "text-red-500 bg-red-50" },
              { icon: Phone, label: "تلفن", value: "034-3245-6789", color: "text-blue-500 bg-blue-50", dir: "ltr" },
              { icon: Mail, label: "ایمیل", value: "info@kafecook.ir", color: "text-green-500 bg-green-50" },
              { icon: Clock, label: "ساعات پاسخ‌گویی", value: "شنبه تا پنجشنبه، ۹ تا ۱۸", color: "text-amber-500 bg-amber-50" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-card">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800" dir={item.dir}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">ارسال پیام</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">نام *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="نام شما"
                    className="input-custom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ایمیل *</label>
                  <input
                    required
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    className="input-custom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">موضوع *</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="موضوع پیام شما"
                  className="input-custom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">پیام *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="پیام خود را بنویسید..."
                  className="input-custom resize-none"
                />
              </div>
              <Button type="submit" loading={loading} size="lg" className="w-full">
                <Send size={16} />
                ارسال پیام
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
