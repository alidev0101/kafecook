/**
 * Seed script for Kafe Cook
 * Run: node scripts/seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kafecook";

// ─── Schemas (inline for standalone script) ────────────────────────────────

const userSchema = new mongoose.Schema(
  { name: String, email: { type: String, unique: true }, phone: String, password: String, role: { type: String, default: "USER" }, isActive: { type: Boolean, default: true }, deletedAt: { type: Date, default: null } },
  { timestamps: true }
);
const categorySchema = new mongoose.Schema(
  { name: String, slug: { type: String, unique: true }, description: String, image: String, icon: String, parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }, order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true }, isFeatured: { type: Boolean, default: false } },
  { timestamps: true }
);
const brandSchema = new mongoose.Schema(
  { name: String, slug: { type: String, unique: true }, description: String, logo: String, origin: String, isActive: { type: Boolean, default: true }, isFeatured: { type: Boolean, default: false } },
  { timestamps: true }
);
const variantSchema = new mongoose.Schema({ weight: Number, weightLabel: String, grindType: { type: String, default: "whole_bean" }, grindLabel: String, price: Number, comparePrice: Number, stock: Number, sku: String });
const productSchema = new mongoose.Schema(
  {
    name: String, slug: { type: String, unique: true }, description: String, shortDescription: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
    images: [{ url: String, alt: String, isPrimary: Boolean }],
    variants: [variantSchema],
    basePrice: Number, baseComparePrice: Number,
    coffeeAttributes: { origin: String, roastLevel: String, roastLevelLabel: String, aroma: String, acidity: Number, body: Number, bitterness: Number, sweetness: Number, brewingMethods: [String], flavorNotes: [String], process: String, variety: String },
    brewingGuide: String,
    tags: [String],
    isActive: { type: Boolean, default: true }, isFeatured: Boolean, isNew: Boolean, isBestSeller: Boolean,
    averageRating: { type: Number, default: 0 }, reviewsCount: { type: Number, default: 0 }, soldCount: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
const couponSchema = new mongoose.Schema(
  { code: { type: String, unique: true }, description: String, type: String, value: Number, maxDiscount: Number, minOrderAmount: { type: Number, default: 0 }, maxUsageCount: Number, maxUsagePerUser: { type: Number, default: 1 }, usedCount: { type: Number, default: 0 }, usedBy: [], startDate: Date, endDate: Date, isActive: { type: Boolean, default: true } },
  { timestamps: true }
);

const User     = mongoose.models.User     || mongoose.model("User",     userSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Brand    = mongoose.models.Brand    || mongoose.model("Brand",    brandSchema);
const Product  = mongoose.models.Product  || mongoose.model("Product",  productSchema);
const Coupon   = mongoose.models.Coupon   || mongoose.model("Coupon",   couponSchema);

// ─── Data ──────────────────────────────────────────────────────────────────

const categoriesData = [
  { name: "اسپرسو", slug: "espresso",     icon: "☕", description: "قهوه‌های مخصوص دستگاه اسپرسو", order: 1, isFeatured: true },
  { name: "دان قهوه", slug: "coffee-beans", icon: "🫘", description: "دان‌های قهوه تازه رست",         order: 2, isFeatured: true },
  { name: "قهوه فیلتری", slug: "filter-coffee", icon: "🫖", description: "مناسب فرنچ پرس و کمکس",    order: 3, isFeatured: true },
  { name: "کولد برو", slug: "cold-brew",    icon: "🧊", description: "قهوه سرد دم‌آوری شده",          order: 4, isFeatured: true },
  { name: "قهوه ویژه", slug: "specialty",   icon: "⭐", description: "قهوه‌های تک‌خاستگاه",          order: 5, isFeatured: true },
  { name: "هدیه قهوه", slug: "gift-sets",   icon: "🎁", description: "ست‌های هدیه قهوه",              order: 6, isFeatured: false },
];

const brandsData = [
  { name: "لاواتزا",  slug: "lavazza",   origin: "ایتالیا", description: "برند ایتالیایی با بیش از ۱۳۰ سال تجربه", isFeatured: true },
  { name: "ایلی",     slug: "illy",      origin: "ایتالیا", description: "پیشگام در قهوه‌های با کیفیت",           isFeatured: true },
  { name: "نسپرسو",   slug: "nespresso", origin: "سوئیس",   description: "سیستم کپسولی محبوب جهان",               isFeatured: true },
  { name: "استارباکس",slug: "starbucks", origin: "آمریکا",  description: "زنجیره کافه معروف جهانی",               isFeatured: false },
  { name: "کافه‌کوک ویژه", slug: "kafecook-special", origin: "ایران", description: "ترکیب اختصاصی کافه کوک", isFeatured: true },
];

function makeProducts(categories, brands) {
  const espresso = categories.find((c) => c.slug === "espresso");
  const beans    = categories.find((c) => c.slug === "coffee-beans");
  const filter   = categories.find((c) => c.slug === "filter-coffee");
  const special  = categories.find((c) => c.slug === "specialty");
  const lavazza  = brands.find((b) => b.slug === "lavazza");
  const illy     = brands.find((b) => b.slug === "illy");
  const kc       = brands.find((b) => b.slug === "kafecook-special");

  const img = (name) => `https://source.unsplash.com/400x400/?coffee,${encodeURIComponent(name)}`;

  return [
    {
      name: "اتیوپی یرگاچف",
      slug: "ethiopia-yirgacheffe",
      shortDescription: "قهوه‌ای با عطر گل‌های یاسمن و طعم توت‌فرنگی",
      description: "یرگاچف از منطقه سیدامو اتیوپی، یکی از بهترین قهوه‌های جهان. عطر گل‌های بهاری و طعم توت‌فرنگی و لیمو دارد. رست لایت تا مدیوم.",
      category: special._id, brand: kc._id,
      images: [{ url: img("ethiopia"), alt: "اتیوپی یرگاچف", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "whole_bean", grindLabel: "دان کامل",     price: 185000, comparePrice: 220000, stock: 28, sku: "ETH-250-WB" },
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 195000, comparePrice: 230000, stock: 15, sku: "ETH-250-ES" },
        { weight: 500, weightLabel: "۵۰۰ گرم", grindType: "whole_bean", grindLabel: "دان کامل",     price: 350000, comparePrice: 420000, stock: 12, sku: "ETH-500-WB" },
      ],
      basePrice: 185000, baseComparePrice: 220000,
      coffeeAttributes: { origin: "اتیوپی، سیدامو", roastLevel: "light", roastLevelLabel: "رست لایت", aroma: "گل یاسمن، توت‌فرنگی، لیمو", acidity: 4, body: 2, bitterness: 1, sweetness: 4, flavorNotes: ["توت‌فرنگی", "لیمو", "گل یاسمن"], process: "Washed", variety: "Arabica", altitude: "۱۸۰۰-۲۲۰۰ متر", brewingMethods: ["french_press", "pour_over", "aeropress"] },
      brewingGuide: "برای فرنچ پرس: ۱۵ گرم قهوه به ازای ۲۵۰ میلی‌لیتر آب ۹۳ درجه. ۴ دقیقه دم بکشید.",
      tags: ["تک‌خاستگاه", "اتیوپی", "لایت رست", "ارگانیک"],
      isActive: true, isFeatured: true, isNew: false, isBestSeller: true, soldCount: 342,
    },
    {
      name: "کلمبیا سوپرمو",
      slug: "colombia-supremo",
      shortDescription: "قهوه متعادل با طعم شکلات و کارامل",
      description: "از بهترین مزارع کلمبیا. متعادل، با تلخی ملایم و طعم شکلات تیره و کارامل. مناسب برای اسپرسو و فیلتر.",
      category: espresso._id, brand: kc._id,
      images: [{ url: img("colombia coffee"), alt: "کلمبیا سوپرمو", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 165000, comparePrice: null,   stock: 32, sku: "COL-250-ES" },
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "whole_bean", grindLabel: "دان کامل",     price: 155000, comparePrice: null,   stock: 20, sku: "COL-250-WB" },
        { weight: 500, weightLabel: "۵۰۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 305000, comparePrice: 350000, stock: 8,  sku: "COL-500-ES" },
      ],
      basePrice: 155000, baseComparePrice: null,
      coffeeAttributes: { origin: "کلمبیا، هوئیلا", roastLevel: "medium", roastLevelLabel: "رست مدیوم", aroma: "شکلات، کارامل، آجیل", acidity: 3, body: 3, bitterness: 2, sweetness: 3, flavorNotes: ["شکلات تیره", "کارامل", "آجیل بو داده"], process: "Washed", variety: "Arabica", altitude: "۱۵۰۰-۱۸۰۰ متر", brewingMethods: ["espresso", "french_press", "moka_pot"] },
      tags: ["کلمبیا", "مدیوم رست", "متعادل"],
      isActive: true, isFeatured: true, isNew: false, isBestSeller: true, soldCount: 278,
    },
    {
      name: "برزیل سانتوس",
      slug: "brazil-santos",
      shortDescription: "قهوه سنگین با تلخی دلپذیر — مناسب شیر",
      description: "برزیل سانتوس با بادی بالا و تلخی متوسط. با شیر بسیار عالی است. یکی از پایه‌های اصلی مخلوط‌های اسپرسو.",
      category: espresso._id, brand: lavazza?._id || null,
      images: [{ url: img("brazil coffee"), alt: "برزیل سانتوس", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 145000, comparePrice: 175000, stock: 45, sku: "BRZ-250-ES" },
        { weight: 500, weightLabel: "۵۰۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 275000, comparePrice: 330000, stock: 20, sku: "BRZ-500-ES" },
        { weight: 1000, weightLabel: "۱ کیلوگرم", grindType: "whole_bean", grindLabel: "دان کامل",  price: 520000, comparePrice: 620000, stock: 10, sku: "BRZ-1KG-WB" },
      ],
      basePrice: 145000, baseComparePrice: 175000,
      coffeeAttributes: { origin: "برزیل، میناس گرایس", roastLevel: "medium_dark", roastLevelLabel: "رست مدیوم دارک", aroma: "شکلات، کره بادام‌زمینی", acidity: 2, body: 4, bitterness: 3, sweetness: 2, flavorNotes: ["شکلات شیری", "کره", "آجیل"], process: "Natural", variety: "Arabica", altitude: "۱۰۰۰-۱۲۰۰ متر", brewingMethods: ["espresso", "moka_pot", "capsule"] },
      tags: ["برزیل", "مدیوم دارک", "با شیر"],
      isActive: true, isFeatured: false, isNew: false, isBestSeller: true, soldCount: 198,
    },
    {
      name: "یمن موکا",
      slug: "yemen-mokha",
      shortDescription: "قهوه نادر با طعم شکلات تیره و توت خشک",
      description: "یمن موکا یکی از قدیمی‌ترین و نادرترین قهوه‌های جهان. طعم شکلات تیره، توت خشک و ادویه‌جات دارد.",
      category: special._id, brand: kc._id,
      images: [{ url: img("yemen mokha"), alt: "یمن موکا", isPrimary: true }],
      variants: [
        { weight: 200, weightLabel: "۲۰۰ گرم", grindType: "whole_bean", grindLabel: "دان کامل", price: 320000, comparePrice: 380000, stock: 8, sku: "YEM-200-WB" },
        { weight: 200, weightLabel: "۲۰۰ گرم", grindType: "medium",    grindLabel: "آسیاب متوسط", price: 330000, comparePrice: 390000, stock: 5, sku: "YEM-200-MD" },
      ],
      basePrice: 320000, baseComparePrice: 380000,
      coffeeAttributes: { origin: "یمن", roastLevel: "medium", roastLevelLabel: "رست مدیوم", aroma: "شکلات تیره، توت خشک، ادویه", acidity: 3, body: 3, bitterness: 2, sweetness: 3, flavorNotes: ["شکلات تیره", "توت", "ادویه"], process: "Natural", variety: "Arabica", altitude: "۱۴۰۰-۲۰۰۰ متر" },
      tags: ["یمن", "نادر", "تک‌خاستگاه"],
      isActive: true, isFeatured: true, isNew: true, isBestSeller: false, soldCount: 67,
    },
    {
      name: "مخلوط اسپرسو کافه کوک",
      slug: "kafecook-espresso-blend",
      shortDescription: "ترکیب اختصاصی برای اسپرسو کامل",
      description: "مخلوطی از بهترین دان‌های برزیل، کلمبیا و اتیوپی. طراحی شده برای دستگاه‌های اسپرسو خانگی و نیمه‌حرفه‌ای.",
      category: espresso._id, brand: kc._id,
      images: [{ url: img("espresso blend"), alt: "مخلوط اسپرسو", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 155000, comparePrice: 185000, stock: 50, sku: "KC-BLEND-250-ES" },
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "whole_bean", grindLabel: "دان کامل",     price: 145000, comparePrice: 175000, stock: 35, sku: "KC-BLEND-250-WB" },
        { weight: 500, weightLabel: "۵۰۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 290000, comparePrice: 350000, stock: 22, sku: "KC-BLEND-500-ES" },
        { weight: 1000, weightLabel: "۱ کیلوگرم", grindType: "whole_bean", grindLabel: "دان کامل", price: 560000, comparePrice: 680000, stock: 10, sku: "KC-BLEND-1KG-WB" },
      ],
      basePrice: 145000, baseComparePrice: 175000,
      coffeeAttributes: { origin: "بلند (برزیل + کلمبیا + اتیوپی)", roastLevel: "medium_dark", roastLevelLabel: "رست مدیوم دارک", aroma: "شکلات، کارامل، میوه‌جات", acidity: 2, body: 4, bitterness: 2, sweetness: 3, flavorNotes: ["شکلات", "کارامل", "توت قرمز"], process: "Mixed", variety: "Blend", brewingMethods: ["espresso", "moka_pot"] },
      brewingGuide: "برای اسپرسو: ۱۸ گرم قهوه، دمای ۹۲-۹۵ درجه، فشار ۹ بار. زمان عصاره‌گیری: ۲۵-۳۰ ثانیه.",
      tags: ["بلند", "اسپرسو", "کافه کوک", "خانگی"],
      isActive: true, isFeatured: true, isNew: false, isBestSeller: true, soldCount: 445,
    },
    {
      name: "کنیا AA",
      slug: "kenya-aa",
      shortDescription: "قهوه روشن با طعم توت سیاه و گریپ‌فروت",
      description: "کنیا AA از بهترین مزارع کنیا. با اسیدیته بالا و طعم توت سیاه، گریپ‌فروت و شکر. رست لایت.",
      category: filter._id, brand: kc._id,
      images: [{ url: img("kenya coffee"), alt: "کنیا AA", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "whole_bean", grindLabel: "دان کامل",    price: 210000, comparePrice: 250000, stock: 18, sku: "KEN-250-WB" },
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "coarse",    grindLabel: "آسیاب درشت",   price: 220000, comparePrice: 260000, stock: 12, sku: "KEN-250-CO" },
      ],
      basePrice: 210000, baseComparePrice: 250000,
      coffeeAttributes: { origin: "کنیا، کیرینیاگا", roastLevel: "light", roastLevelLabel: "رست لایت", aroma: "توت سیاه، گریپ‌فروت، گل رز", acidity: 5, body: 2, bitterness: 1, sweetness: 4, flavorNotes: ["توت سیاه", "گریپ‌فروت", "شکر قهوه‌ای"], process: "Washed", variety: "Arabica", altitude: "۱۶۰۰-۲۰۰۰ متر", brewingMethods: ["pour_over", "french_press", "aeropress"] },
      tags: ["کنیا", "لایت رست", "اسیدیته بالا", "میوه‌ای"],
      isActive: true, isFeatured: false, isNew: true, isBestSeller: false, soldCount: 89,
    },
    {
      name: "کولد برو آماده",
      slug: "cold-brew-ready",
      shortDescription: "مخلوط ویژه برای تهیه کولد برو در خانه",
      description: "دان‌های انتخابی آسیاب درشت برای دم‌آوری سرد. ۱۲ تا ۲۴ ساعت در آب سرد بگذارید و از نوشیدنی بی‌نظیر لذت ببرید.",
      category: filter._id, brand: kc._id,
      images: [{ url: img("cold brew coffee"), alt: "کولد برو", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "coarse", grindLabel: "آسیاب درشت (کولد برو)", price: 175000, comparePrice: 210000, stock: 25, sku: "CB-250-CO" },
      ],
      basePrice: 175000, baseComparePrice: 210000,
      coffeeAttributes: { origin: "بلند چند خاستگاه", roastLevel: "medium", roastLevelLabel: "رست مدیوم", aroma: "شکلات، وانیل، کارامل", acidity: 1, body: 3, bitterness: 1, sweetness: 4, flavorNotes: ["شکلات شیری", "وانیل", "کارامل"], process: "Mixed", variety: "Blend", brewingMethods: ["cold_brew"] },
      brewingGuide: "۱۰۰ گرم قهوه در ۱ لیتر آب سرد. ۱۲-۲۴ ساعت در یخچال بگذارید. صاف کنید و با یخ سرو کنید.",
      tags: ["کولد برو", "تابستانی", "بدون تلخی"],
      isActive: true, isFeatured: false, isNew: true, isBestSeller: false, soldCount: 54,
    },
    {
      name: "لاواتزا گرند اسپرسو",
      slug: "lavazza-gran-espresso",
      shortDescription: "مخلوط ایتالیایی کلاسیک برای اسپرسو بی‌نقص",
      description: "مخلوط کلاسیک لاواتزا با ۸۰٪ عربیکا و ۲۰٪ روبوستا. کرمای طلایی غنی و طعم ماندگار.",
      category: espresso._id, brand: lavazza?._id || null,
      images: [{ url: img("lavazza espresso"), alt: "لاواتزا گرند اسپرسو", isPrimary: true }],
      variants: [
        { weight: 250, weightLabel: "۲۵۰ گرم", grindType: "espresso",   grindLabel: "آسیاب اسپرسو",  price: 195000, comparePrice: 230000, stock: 30, sku: "LAV-250-ES" },
        { weight: 1000, weightLabel: "۱ کیلوگرم", grindType: "whole_bean", grindLabel: "دان کامل",  price: 720000, comparePrice: 850000, stock: 7,  sku: "LAV-1KG-WB" },
      ],
      basePrice: 195000, baseComparePrice: 230000,
      coffeeAttributes: { origin: "ایتالیا (بلند)", roastLevel: "dark", roastLevelLabel: "رست دارک", aroma: "کارامل، فندق، کرم", acidity: 2, body: 5, bitterness: 4, sweetness: 2, flavorNotes: ["کارامل", "فندق", "دارچین"], process: "Mixed", variety: "Blend (80% Arabica)", brewingMethods: ["espresso", "moka_pot"] },
      tags: ["لاواتزا", "ایتالیایی", "دارک رست", "کرما"],
      isActive: true, isFeatured: true, isNew: false, isBestSeller: true, soldCount: 312,
    },
  ];
}

// ─── Seed ──────────────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log("🔌 اتصال به MongoDB...");
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("✅ متصل شد\n");

    // ── Clear collections ──
    console.log("🗑️  پاک کردن داده‌های قبلی...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log("✅ پاک شد\n");

    // ── Users ──
    console.log("👤 ایجاد کاربران...");
    const hashedAdmin = await bcrypt.hash("Admin@123456", 12);
    const hashedUser  = await bcrypt.hash("User@123456",  12);

    const [admin, user1] = await User.insertMany([
      { name: "مدیر کافه کوک", email: "admin@kafecook.ir",  phone: "09120000001", password: hashedAdmin, role: "ADMIN",  isActive: true },
      { name: "علی رضایی",     email: "ali@example.com",   phone: "09120000002", password: hashedUser,  role: "USER",   isActive: true },
      { name: "فاطمه محمدی",   email: "fateme@example.com", phone: "09120000003", password: hashedUser,  role: "USER",   isActive: true },
    ]);
    console.log(`   ✅ ${3} کاربر ایجاد شد`);
    console.log(`   🔑 ادمین: admin@kafecook.ir / Admin@123456`);
    console.log(`   👤 کاربر: ali@example.com   / User@123456\n`);

    // ── Categories ──
    console.log("📂 ایجاد دسته‌بندی‌ها...");
    const categories = await Category.insertMany(categoriesData);
    console.log(`   ✅ ${categories.length} دسته‌بندی ایجاد شد\n`);

    // ── Brands ──
    console.log("🏷️  ایجاد برندها...");
    const brands = await Brand.insertMany(brandsData);
    console.log(`   ✅ ${brands.length} برند ایجاد شد\n`);

    // ── Products ──
    console.log("📦 ایجاد محصولات...");
    const productsData = makeProducts(categories, brands);
    const products = await Product.insertMany(productsData);
    console.log(`   ✅ ${products.length} محصول ایجاد شد\n`);

    // ── Coupons ──
    console.log("🎟️  ایجاد کدهای تخفیف...");
    await Coupon.insertMany([
      {
        code: "WELCOME10",
        description: "تخفیف خوش‌آمدگویی ۱۰٪",
        type: "percentage",
        value: 10,
        minOrderAmount: 200000,
        maxUsageCount: 500,
        maxUsagePerUser: 1,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: "COFFEE50",
        description: "تخفیف ۵۰ هزار تومانی",
        type: "fixed",
        value: 50000,
        minOrderAmount: 500000,
        maxUsageCount: 200,
        maxUsagePerUser: 1,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "SUMMER20",
        description: "تخفیف تابستانی ۲۰٪",
        type: "percentage",
        value: 20,
        maxDiscount: 100000,
        minOrderAmount: 300000,
        maxUsageCount: 100,
        maxUsagePerUser: 2,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`   ✅ 3 کد تخفیف ایجاد شد\n`);

    console.log("━".repeat(50));
    console.log("🎉 Seed با موفقیت انجام شد!\n");
    console.log("📊 خلاصه:");
    console.log(`   👥 کاربران:     3`);
    console.log(`   📂 دسته‌بندی:   ${categories.length}`);
    console.log(`   🏷️  برندها:      ${brands.length}`);
    console.log(`   📦 محصولات:     ${products.length}`);
    console.log(`   🎟️  کدهای تخفیف: 3`);
    console.log("\n🔗 لینک‌های مفید:");
    console.log("   http://localhost:3000         → فروشگاه");
    console.log("   http://localhost:3000/admin   → پنل ادمین");
    console.log("   http://localhost:3000/login   → صفحه ورود");

  } catch (err) {
    console.error("❌ خطا:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 اتصال بسته شد");
    process.exit(0);
  }
}

seed();
