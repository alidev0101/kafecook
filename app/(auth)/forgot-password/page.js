"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/validations/auth";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });

      toast.success("کد تأیید به ایمیل شما ارسال شد");

      router.push(
        `/verify-otp?email=${encodeURIComponent(data.email)}&type=forgot`
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "خطایی رخ داد"
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
          <Mail size={24} className="text-coffee-400" />
        </div>
      </div>

      <h1
        className="text-2xl font-black text-white text-center mb-1.5"
        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
      >
        فراموشی رمز عبور
      </h1>

      <p className="text-coffee-300 text-sm text-center mb-8 leading-6">
        ایمیل حساب کاربری خود را وارد کنید تا کد تأیید برای شما ارسال شود
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-coffee-200 mb-1.5">
            ایمیل <span className="text-red-400">*</span>
          </label>

          <div className="relative">
            <Mail
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              type="email"
              dir="ltr"
              placeholder="example@email.com"
              className={`w-full h-11 pr-10 pl-4 rounded-xl border bg-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 transition-all ${
                errors.email
                  ? "border-red-400"
                  : "border-white/20 hover:border-white/40"
              }`}
              {...register("email")}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full bg-coffee-500 hover:bg-coffee-400"
        >
          ارسال کد تأیید <ArrowLeft size={16} />
        </Button>
      </form>

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