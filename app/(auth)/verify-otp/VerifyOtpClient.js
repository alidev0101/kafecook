"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const RESEND_TIME = 120;

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const type = searchParams.get("type") || "register";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_TIME);

  const inputs = useRef([]);
  const submitting = useRef(false);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const verifyCode = async (otp) => {
    if (submitting.current || otp.length !== 6) return;

    submitting.current = true;
    setLoading(true);

    try {
      if (type === "register") {
        await axios.post("/api/auth/verify-register", {
          email,
          code: otp,
        });

        toast.success("ثبت‌نام با موفقیت انجام شد");

        router.push(`/login`);
      } else {
        const { data } = await axios.post("/api/auth/verify-forgot", {
          email,
          code: otp,
        });

        router.push(
          `/reset-password?token=${encodeURIComponent(data.data.token)}`
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "کد تأیید صحیح نیست"
      );
      submitting.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...code];
    next[index] = value;
    setCode(next);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const otp = next.join("");

      if (otp.length === 6) {
        verifyCode(otp);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = ["", "", "", "", "", ""];

    pasted.split("").forEach((item, index) => {
      next[index] = item;
    });

    setCode(next);

    if (pasted.length === 6) {
      verifyCode(pasted);
    } else {
      inputs.current[pasted.length]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = code.join("");

    if (otp.length !== 6) {
      toast.error("کد ۶ رقمی را کامل وارد کنید");
      return;
    }

    await verifyCode(otp);
  };

  const handleResend = async () => {
    if (seconds > 0 || resendLoading || !email) return;

    setResendLoading(true);

    try {
      const endpoint =
        type === "register"
          ? "/api/auth/register/resend-otp"
          : "/api/auth/forgot-password";

      await axios.post(endpoint, { email });

      setCode(["", "", "", "", "", ""]);
      setSeconds(RESEND_TIME);
      submitting.current = false;

      toast.success("کد تأیید جدید ارسال شد");

      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "خطا در ارسال مجدد کد"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
    >
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-coffee-500/20 flex items-center justify-center">
          <Mail className="text-coffee-400" />
        </div>
      </div>

      <h1
        className="text-2xl font-black text-white text-center"
        style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
      >
        تأیید ایمیل
      </h1>

      <p className="text-coffee-300 text-sm text-center mt-2 mb-8 leading-6">
        کد ۶ رقمی ارسال شده به
        <br />
        <span className="text-white" dir="ltr">
          {email}
        </span>{" "}
        را وارد کنید
      </p>

      <form onSubmit={handleSubmit}>
        <div
          dir="ltr"
          className="flex justify-center gap-2 mb-6"
          onPaste={handlePaste}
        >
          {code.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              value={value}
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 text-center text-md font-bold rounded-xl border border-white/20 bg-white/10 text-white outline-none focus:border-coffee-400 focus:ring-2 focus:ring-coffee-400/20"
            />
          ))}
        </div>

        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full bg-coffee-500 hover:bg-coffee-400"
        >
          تأیید کد <ArrowLeft size={16} />
        </Button>
      </form>

      <div className="mt-5 text-center">
        {seconds > 0 ? (
          <p className="text-sm text-gray-400">
            ارسال مجدد کد تا{" "}
            <span className="text-coffee-400 font-semibold" dir="ltr">
              {formatTime(seconds)}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="inline-flex items-center gap-2 text-sm text-coffee-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              size={15}
              className={resendLoading ? "animate-spin" : ""}
            />
            {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
