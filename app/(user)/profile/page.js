"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import UserSidebar from "@/components/shared/UserSidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [showPassForm, setShowPassForm] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      name: session?.user?.name || "",
      phone: session?.user?.phone || "",
    },
  });

  const passwordForm = useForm();

  const profileMutation = useMutation({
    mutationFn: (data) => axios.put("/api/users/me", data).then((r) => r.data),
    onSuccess: async (res) => {
      await update({ name: res.data.name, phone: res.data.phone });
      toast.success("پروفایل با موفقیت بروزرسانی شد");
    },
    onError: (err) => toast.error(err.response?.data?.message || "خطا در بروزرسانی"),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => axios.put("/api/users/me/password", data),
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت تغییر کرد");
      passwordForm.reset();
      setShowPassForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "خطا در تغییر رمز"),
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "پروفایل" }]} />
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <UserSidebar />
        <main className="flex-1 space-y-5">
          {/* Profile info */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-coffee-100 flex items-center justify-center">
                <User size={16} className="text-coffee-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">اطلاعات شخصی</h2>
            </div>
            <form
              onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="نام و نام خانوادگی"
                  placeholder="نام کامل"
                  {...profileForm.register("name", { required: "نام الزامی است" })}
                  error={profileForm.formState.errors.name?.message}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ایمیل</label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    readOnly
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">ایمیل قابل تغییر نیست</p>
                </div>
              </div>
              <Input
                label="شماره موبایل"
                placeholder="09123456789"
                dir="ltr"
                {...profileForm.register("phone")}
              />
              <div className="flex justify-end">
                <Button type="submit" loading={profileMutation.isPending}>
                  ذخیره تغییرات
                </Button>
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <button
              onClick={() => setShowPassForm(!showPassForm)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-coffee-100 flex items-center justify-center">
                  <Lock size={16} className="text-coffee-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">تغییر رمز عبور</h2>
              </div>
              <span className="text-sm text-coffee-600">{showPassForm ? "بستن" : "تغییر"}</span>
            </button>

            {showPassForm && (
              <form
                onSubmit={passwordForm.handleSubmit((data) => passwordMutation.mutate(data))}
                className="mt-5 space-y-4"
              >
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز عبور فعلی *</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      className="w-full h-11 px-4 pl-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500"
                      {...passwordForm.register("currentPassword", { required: true })}
                    />
                    <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز عبور جدید *</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      className="w-full h-11 px-4 pl-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500"
                      {...passwordForm.register("newPassword", { required: true, minLength: 6 })}
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Input
                  label="تکرار رمز عبور جدید *"
                  type="password"
                  {...passwordForm.register("confirmNewPassword", { required: true })}
                />
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" type="button" onClick={() => { setShowPassForm(false); passwordForm.reset(); }}>
                    انصراف
                  </Button>
                  <Button type="submit" loading={passwordMutation.isPending}>
                    تغییر رمز
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
