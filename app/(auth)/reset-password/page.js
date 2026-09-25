"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/validations/auth";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("لینک تغییر رمز معتبر نیست");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success("رمز عبور با موفقیت تغییر کرد");

      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "خطا در تغییر رمز عبور"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
    >
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-coffee-500/15 border border-coffee-500/20 flex items-center justify-center">
          <Lock size={24} className="text-coffee-400" />
        </div>
      </div>

      <h1
        className="text-2xl font-black text-white text-center mb-1.5"
        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
      >
        تغییر رمز عبور
      </h1>

      <p className="text-coffee-300 text-sm text-center mb-8 leading-6">
        رمز عبور جدید خود را وارد کنید
      </p>

      {!token ? (
        <div className="text-center">
          <p className="text-sm text-red-400 mb-5">
            لینک تغییر رمز معتبر نیست یا منقضی شده است.
          </p>

          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-coffee-400 hover:text-white transition-colors"
          >
            درخواست لینک جدید
            <ArrowLeft size={15} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-coffee-200 mb-1.5">
              رمز عبور جدید <span className="text-red-400">*</span>
            </label>

            <div className="relative">
              <Lock
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="حداقل ۶ کاراکتر"
                className={`w-full h-11 pr-10 pl-10 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${
                  errors.password
                    ? "border-red-400"
                    : "border-white/20 hover:border-white/40"
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-200 mb-1.5">
              تکرار رمز عبور جدید <span className="text-red-400">*</span>
            </label>

            <div className="relative">
              <Lock
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="رمز عبور جدید را دوباره وارد کنید"
                className={`w-full h-11 pr-10 pl-10 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-white/20 hover:border-white/40"
                }`}
                {...register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full mt-2 bg-coffee-500 hover:bg-coffee-400"
          >
            تغییر رمز عبور <ArrowLeft size={16} />
          </Button>
        </form>
      )}

      <div className="flex items-center justify-center gap-2 mt-6">
        <Link
          href="/login"
          className="flex items-center gap-1 text-sm text-coffee-400 hover:text-white transition-colors"
        >
          <ArrowRight size={14} />
          بازگشت به صفحه ورود
        </Link>
      </div>
    </motion.div>
  );
}