import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "ایمیل الزامی است" })
    .min(1, "ایمیل الزامی است")
    .email("ایمیل معتبر نیست"),
  password: z
    .string({ required_error: "رمز عبور الزامی است" })
    .min(1, "رمز عبور الزامی است"),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "نام الزامی است" })
      .min(2, "نام باید حداقل ۲ کاراکتر باشد")
      .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),
    email: z
      .string({ required_error: "ایمیل الزامی است" })
      .min(1, "ایمیل الزامی است")
      .email("ایمیل معتبر نیست"),
    phone: z
      .string()
      .regex(/^09[0-9]{9}$/, "شماره موبایل معتبر نیست")
      .optional()
      .or(z.literal("")),
    password: z
      .string({ required_error: "رمز عبور الزامی است" })
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
      .max(50, "رمز عبور نباید بیشتر از ۵۰ کاراکتر باشد"),
    confirmPassword: z.string({ required_error: "تکرار رمز عبور الزامی است" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("ایمیل وارد شده معتبر نیست"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "توکن تغییر رمز معتبر نیست"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "رمز عبور فعلی الزامی است" })
      .min(1, "رمز عبور فعلی الزامی است"),
    newPassword: z
      .string({ required_error: "رمز عبور جدید الزامی است" })
      .min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "رمز عبور جدید و تکرار آن یکسان نیستند",
    path: ["confirmNewPassword"],
  });
