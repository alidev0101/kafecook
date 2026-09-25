"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, Store, Truck, CreditCard, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("تنظیمات ذخیره شد");
    setSaving(false);
  };

  return (
    <div className="max-w-7xl space-y-6">
      <h1 className="text-xl font-bold text-gray-900">تنظیمات فروشگاه</h1>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Store info */}
        <SettingSection icon={Store} title="اطلاعات فروشگاه">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="نام فروشگاه" defaultValue="کافه کوک" />
            <Input label="ایمیل تماس" defaultValue="info@kafecook.ir" dir="ltr" />
            <Input label="شماره تماس" defaultValue="034-3245-6789" dir="ltr" />
            <Input label="آدرس" defaultValue="کرمان، خیابان شریعتی" />
          </div>
        </SettingSection>

        {/* Shipping */}
        <SettingSection icon={Truck} title="تنظیمات ارسال">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="هزینه ارسال عادی (تومان)" type="number" defaultValue="35000" />
            <Input label="هزینه ارسال اکسپرس (تومان)" type="number" defaultValue="70000" />
            <div className="sm:col-span-2">
              <Input label="حداقل مبلغ ارسال رایگان (تومان)" type="number" defaultValue="500000" />
            </div>
          </div>
        </SettingSection>

        {/* Payment */}
        <SettingSection icon={CreditCard} title="تنظیمات پرداخت">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="مرچنت کد درگاه" placeholder="درگاه پرداخت" dir="ltr" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">درگاه پرداخت</label>
              <select className="input-custom h-11">
                <option value="zarinpal">زرین‌پال</option>
                <option value="idpay">آی‌دی‌پی</option>
                <option value="test">تست</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-3">
            <input type="checkbox" className="w-4 h-4 accent-coffee-600 rounded" defaultChecked />
            <span className="text-sm text-gray-700">فعال‌سازی پرداخت در محل (COD)</span>
          </label>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="اعلان‌ها">
          <div className="space-y-3">
            {[
              "ارسال ایمیل برای سفارش جدید",
              "ارسال ایمیل برای تغییر وضعیت",
              "اطلاع‌رسانی موجودی کم محصولات",
              "ارسال خبرنامه",
            ].map((label) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-coffee-600 rounded" defaultChecked />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </SettingSection>

        <Button type="submit" loading={saving} size="lg">
          <Save size={17} />
          ذخیره تنظیمات
        </Button>
      </form>
    </div>
  );
}

function SettingSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-coffee-50 flex items-center justify-center">
          <Icon size={16} className="text-coffee-600" />
        </div>
        {title}
      </h2>
      {children}
    </div>
  );
}
