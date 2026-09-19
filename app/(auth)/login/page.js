"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/validations/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "ایمیل یا رمز عبور اشتباه است");
      } else {
        toast.success("خوش آمدید!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("خطا در ورود. لطفاً دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
      <h1 className="text-2xl font-black text-white text-center mb-2">ورود به حساب</h1>
      <p className="text-coffee-300 text-sm text-center mb-8">
        به کافه کوک خوش آمدید
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-coffee-200 mb-1.5">
            ایمیل <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="email"
              placeholder="example@email.com"
              dir="ltr"
              className={`w-full h-11 pr-10 pl-4 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${
                errors.email ? "border-red-400" : "border-white/20 hover:border-white/40"
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-coffee-200">
              رمز عبور <span className="text-red-400">*</span>
            </label>
            <Link href="/forgot-password" className="text-xs text-coffee-400 hover:text-coffee-200">
              فراموشی رمز
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور خود را وارد کنید"
              className={`w-full h-11 pr-10 pl-10 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${
                errors.password ? "border-red-400" : "border-white/20 hover:border-white/40"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full mt-2 bg-coffee-500 hover:bg-coffee-400"
        >
          ورود به حساب
        </Button>
      </form>

      <p className="text-center text-sm text-coffee-400 mt-6">
        حساب ندارید؟{" "}
        <Link href="/register" className="text-coffee-200 hover:text-white font-medium">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}
