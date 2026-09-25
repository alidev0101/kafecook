import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns-jalali";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format price to Persian locale
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

// Format number to Persian
export function formatNumber(num) {
  if (num === null || num === undefined) return "۰";
  return new Intl.NumberFormat("fa-IR").format(num);
}

// Persian date formatter
export function formatDate(date, options = {}) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Relative time
export function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(date);
  if (days > 0) return `${formatNumber(days)} روز پیش`;
  if (hours > 0) return `${formatNumber(hours)} ساعت پیش`;
  if (minutes > 0) return `${formatNumber(minutes)} دقیقه پیش`;
  return "همین الان";
}

// Discount percent
export function calcDiscount(original, current) {
  if (!original || !current || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

// Truncate text
export function truncate(text, length = 100) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Generate slug (client-side)
export function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-");
}

// Order status config
export const ORDER_STATUS = {
  pending: { label: "در انتظار تأیید", color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "در حال پردازش", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "ارسال شده", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "تحویل داده شده", color: "bg-green-100 text-green-700" },
  cancelled: { label: "لغو شده", color: "bg-red-100 text-red-700" },
  refunded: { label: "مسترد شده", color: "bg-gray-100 text-gray-700" },
};

export const PAYMENT_STATUS = {
  unpaid: {
    label: "پرداخت نشده",
    color: "bg-red-100 text-red-700",
  },
  pending: {
    label: "در انتظار پرداخت",
    color: "bg-yellow-100 text-yellow-700",
  },
  paid: {
    label: "پرداخت شده",
    color: "bg-green-100 text-green-700",
  },
  failed: {
    label: "ناموفق",
    color: "bg-red-100 text-red-700",
  },
};

export const ROAST_LABELS = {
  light: "رست لایت",
  medium_light: "رست مدیوم لایت",
  medium: "رست مدیوم",
  medium_dark: "رست مدیوم دارک",
  dark: "رست دارک",
};

export const GRIND_LABELS = {
  whole_bean: "دان کامل",
  fine: "آسیاب ریز",
  medium: "آسیاب متوسط",
  coarse: "آسیاب درشت",
  espresso: "آسیاب اسپرسو",
};

// Shipping methods
export const SHIPPING_METHODS = [
  {
    value: "standard",
    label: "ارسال معمولی",
    desc: "۳ تا ۵ روز کاری",
    price: 35000,
  },
  {
    value: "express",
    label: "ارسال اکسپرس",
    desc: "۱ تا ۲ روز کاری",
    price: 70000,
  },
  {
    value: "pickup",
    label: "دریافت حضوری",
    desc: "مراجعه به فروشگاه",
    price: 0,
  },
];
