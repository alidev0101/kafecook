import { z } from "zod";

const variantSchema = z.object({
  weight: z.number({ required_error: "وزن الزامی است" }).positive("وزن باید مثبت باشد"),
  weightLabel: z.string().min(1, "برچسب وزن الزامی است"),
  grindType: z
    .enum(["whole_bean", "fine", "medium", "coarse", "espresso"])
    .default("whole_bean"),
  grindLabel: z.string().optional(),
  price: z.number({ required_error: "قیمت الزامی است" }).nonnegative("قیمت نمی‌تواند منفی باشد"),
  comparePrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative("موجودی نمی‌تواند منفی باشد").default(0),
  sku: z.string().optional(),
});

export const productSchema = z.object({
  name: z
    .string({ required_error: "نام محصول الزامی است" })
    .min(2, "نام محصول باید حداقل ۲ کاراکتر باشد")
    .max(120, "نام محصول نباید بیشتر از ۱۲۰ کاراکتر باشد"),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  category: z.string({ required_error: "دسته‌بندی الزامی است" }).min(1),
  brand: z.string().nullable().optional(),
  variants: z
    .array(variantSchema)
    .min(1, "حداقل یک ویریانت الزامی است"),
  coffeeAttributes: z
    .object({
      origin: z.string().optional(),
      roastLevel: z
        .enum(["light", "medium_light", "medium", "medium_dark", "dark"])
        .optional(),
      aroma: z.string().optional(),
      acidity: z.number().min(1).max(5).optional(),
      body: z.number().min(1).max(5).optional(),
      bitterness: z.number().min(1).max(5).optional(),
      sweetness: z.number().min(1).max(5).optional(),
      brewingMethods: z.array(z.string()).optional(),
      flavorNotes: z.array(z.string()).optional(),
      process: z.string().optional(),
      variety: z.string().optional(),
      altitude: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const reviewSchema = z.object({
  rating: z
    .number({ required_error: "امتیاز الزامی است" })
    .min(1, "امتیاز باید حداقل ۱ باشد")
    .max(5, "امتیاز نباید بیشتر از ۵ باشد"),
  title: z.string().max(100).optional(),
  body: z
    .string({ required_error: "متن نظر الزامی است" })
    .min(10, "نظر باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "نظر نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});
