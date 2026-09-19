import { z } from "zod";

export const addressSchema = z.object({
  title: z.string().min(1, "عنوان آدرس الزامی است").max(50),
  recipientName: z.string().min(2, "نام گیرنده الزامی است").max(60),
  phone: z
    .string()
    .regex(/^09[0-9]{9}$/, "شماره موبایل معتبر نیست"),
  province: z.string().min(1, "استان الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  district: z.string().optional(),
  street: z.string().min(1, "خیابان الزامی است"),
  alley: z.string().optional(),
  buildingNumber: z.string().optional(),
  unit: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^[0-9]{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  isDefault: z.boolean().default(false),
  notes: z.string().max(200).optional(),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "آدرس ارسال الزامی است"),
  shippingMethod: z.enum(["standard", "express", "pickup"]).default("standard"),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["online", "cod"]).default("online"),
});

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "کد تخفیف باید حداقل ۳ کاراکتر باشد")
    .max(20, "کد تخفیف نباید بیشتر از ۲۰ کاراکتر باشد")
    .toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive("مقدار تخفیف باید مثبت باشد"),
  maxDiscount: z.number().positive().nullable().optional(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxUsageCount: z.number().int().positive().nullable().optional(),
  maxUsagePerUser: z.number().int().positive().default(1),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).nullable().optional(),
  isActive: z.boolean().default(true),
  description: z.string().max(200).optional(),
});
