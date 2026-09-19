"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { registerSchema } from "@/validations/auth";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/register", data);
      toast.success("ثبت‌نام موفق! در حال ورود...");
      const result = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      if (!result?.error) { router.push("/"); router.refresh(); }
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, icon: Icon, placeholder, type = "text", dir }) => (
    <div>
      <label className="block text-sm font-medium text-coffee-200 mb-1.5">
        {label} {name !== "phone" && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type={type}
          dir={dir}
          placeholder={placeholder}
          className={`w-full h-11 pr-10 pl-4 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${errors[name] ? "border-red-400" : "border-white/20 hover:border-white/40"}`}
          {...register(name)}
        />
      </div>
      {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
    >
      <h1 className="text-2xl font-black text-white text-center mb-1.5"
        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}>
        ثبت‌نام
      </h1>
      <p className="text-coffee-300 text-sm text-center mb-8">حساب جدید در کافه کوک بسازید</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field name="name"  label="نام و نام خانوادگی" icon={User}  placeholder="مثلاً: علی رضایی" />
        <Field name="email" label="ایمیل"               icon={Mail}  placeholder="example@email.com" type="email" dir="ltr" />
        <Field name="phone" label="موبایل (اختیاری)"    icon={Phone} placeholder="09123456789" type="tel" dir="ltr" />

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-coffee-200 mb-1.5">
            رمز عبور <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="حداقل ۶ کاراکتر"
              className={`w-full h-11 pr-10 pl-10 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${errors.password ? "border-red-400" : "border-white/20 hover:border-white/40"}`}
              {...register("password")}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-coffee-200 mb-1.5">
            تکرار رمز <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="password"
              placeholder="رمز عبور را دوباره وارد کنید"
              className={`w-full h-11 pr-10 pl-4 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${errors.confirmPassword ? "border-red-400" : "border-white/20 hover:border-white/40"}`}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" loading={loading} size="lg" className="w-full mt-2 bg-coffee-500 hover:bg-coffee-400">
          ایجاد حساب کاربری <ArrowLeft size={16} />
        </Button>
      </form>

      <p className="text-center text-sm text-coffee-400 mt-6">
        حساب دارید؟{" "}
        <Link href="/login" className="text-coffee-200 hover:text-white font-medium transition-colors">
          وارد شوید
        </Link>
      </p>
    </motion.div>
  );
}
