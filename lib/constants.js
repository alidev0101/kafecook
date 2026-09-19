export const APP_NAME = "کافه کوک";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ROLES = { USER: "USER", ADMIN: "ADMIN" };

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
export const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];

export const FREE_SHIPPING_THRESHOLD = 500000; // 500k toman
export const SHIPPING_COSTS = { standard: 35000, express: 70000, pickup: 0 };

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 15;

export const PERSIAN_MONTHS = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند",
];

export const PROVINCES = [
  "آذربایجان شرقی","آذربایجان غربی","اردبیل","اصفهان","البرز",
  "ایلام","بوشهر","تهران","چهارمحال و بختیاری","خراسان جنوبی",
  "خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان",
  "سیستان و بلوچستان","فارس","قزوین","قم","کردستان",
  "کرمان","کرمانشاه","کهگیلویه و بویراحمد","گلستان","گیلان",
  "لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد",
];
