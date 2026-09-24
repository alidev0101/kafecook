/**
 * Seed script for Kafe Cook
 * Run: node scripts/seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sobhanmosazadeh8585_db_user:8ZzOCmeIP0e1boMe@clusterkafecook.fkmnhea.mongodb.net/?appName=ClusterKafeCook";

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

const blogCategorySchema = new mongoose.Schema(
  { name: String, slug: { type: String, unique: true }, description: String, color: { type: String, default: "#be7040" }, order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true } },
  { timestamps: true }
);
const postSchema2 = new mongoose.Schema(
  {
    title: String, slug: { type: String, unique: true }, excerpt: String, content: String,
    featuredImage: { url: String, alt: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" },
    tags: [String], author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "draft" }, publishedAt: Date, readTime: { type: Number, default: 1 },
    postType: { type: String, default: "article" }, isFeatured: Boolean,
    metaTitle: String, metaDescription: String, viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.models.BlogCategory || mongoose.model("BlogCategory", blogCategorySchema);
const Post         = mongoose.models.Post         || mongoose.model("Post",         postSchema2);

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

  const img = () => "";

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
      BlogCategory.deleteMany({}),
      Post.deleteMany({}),
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

    // ── Blog Categories ──
    console.log("📚 ایجاد دسته‌بندی‌های وبلاگ...");
    const blogCats = await BlogCategory.insertMany([
      { name: "آموزش دم‌آوری",   slug: "brewing-guide",   color: "#be7040", order: 1, description: "راهنمای کامل روش‌های مختلف دم‌آوری قهوه" },
      { name: "معرفی قهوه‌ها",   slug: "coffee-origins",  color: "#92462c", order: 2, description: "آشنایی با انواع قهوه‌های تک‌خاستگاه از سراسر جهان" },
      { name: "تجهیزات قهوه",   slug: "coffee-equipment", color: "#6b3a1f", order: 3, description: "راهنمای خرید و استفاده از تجهیزات قهوه" },
      { name: "اخبار قهوه",      slug: "coffee-news",      color: "#4a7c59", order: 4, description: "آخرین اخبار دنیای قهوه" },
      { name: "سبک زندگی قهوه", slug: "coffee-lifestyle",  color: "#2d6a8f", order: 5, description: "قهوه در زندگی روزمره" },
    ]);
    console.log(`   ✅ ${blogCats.length} دسته‌بندی وبلاگ ایجاد شد\n`);

    // ── Blog Posts ──
    console.log("📝 ایجاد مقالات وبلاگ...");
    const brewingCat  = blogCats.find((c) => c.slug === "brewing-guide");
    const originsCat  = blogCats.find((c) => c.slug === "coffee-origins");
    const equipCat    = blogCats.find((c) => c.slug === "coffee-equipment");
    const lifestyleCat= blogCats.find((c) => c.slug === "coffee-lifestyle");

    const posts = await Post.insertMany([
      {
        title:    "راهنمای کامل دم‌آوری فرنچ پرس در خانه",
        slug:     "french-press-guide",
        excerpt:  "فرنچ پرس یکی از ساده‌ترین و در عین حال بهترین روش‌های دم‌آوری قهوه است. در این مقاله همه چیز را به شما آموزش می‌دهیم.",
        content:  `<h2>فرنچ پرس چیست؟</h2><p>فرنچ پرس (French Press) یکی از محبوب‌ترین روش‌های دم‌آوری قهوه در جهان است که با استفاده از فشار مکانیکی، قهوه را از آب جدا می‌کند.</p><h2>تجهیزات مورد نیاز</h2><ul><li>فرنچ پرس ۳۵۰ میلی‌لیتری یا بزرگ‌تر</li><li>آسیاب قهوه با آسیاب درشت</li><li>دماسنج آب</li><li>ترازو دیجیتال</li></ul><h2>دستور دم‌آوری</h2><p>نسبت قهوه به آب: <strong>۱۵ گرم قهوه به ازای ۲۵۰ میلی‌لیتر آب</strong></p><ol><li>آب را تا دمای ۹۳-۹۵ درجه سانتیگراد گرم کنید</li><li>قهوه را با آسیاب درشت آسیاب کنید</li><li>قهوه را در فرنچ پرس بریزید</li><li>آب گرم را روی قهوه بریزید و هم بزنید</li><li>۴ دقیقه صبر کنید</li><li>پیستون را آرام فشار دهید و سرو کنید</li></ol><blockquote>نکته: قهوه‌ای با اسیدیته متوسط و بادی بالا بهترین انتخاب برای فرنچ پرس است.</blockquote>`,
        category: brewingCat._id,
        author:   admin._id,
        status:   "published",
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        readTime: 5,
        postType: "tutorial",
        isFeatured: true,
        tags: ["فرنچ پرس", "آموزش", "دم‌آوری"],
        metaTitle: "راهنمای کامل دم‌آوری فرنچ پرس | کافه کوک",
        metaDescription: "یاد بگیرید چطور با فرنچ پرس بهترین قهوه را در خانه دم بکشید. راهنمای گام به گام با نکات حرفه‌ای.",
        viewCount: 342,
      },
      {
        title:    "آشنایی با قهوه اتیوپی؛ مهد قهوه جهان",
        slug:     "ethiopia-coffee-origin",
        excerpt:  "اتیوپی زادگاه قهوه است. از مناطق یرگاچف و سیدامو تا جیما — هر منطقه داستان و طعم منحصربه‌فرد خود را دارد.",
        content:  `<h2>اتیوپی؛ جایی که قهوه متولد شد</h2><p>طبق افسانه‌های تاریخی، کالدی، چوپانی در اتیوپی، اولین کسی بود که متوجه خواص انرژی‌بخش قهوه شد وقتی بزهایش پس از خوردن دانه‌های قهوه بسیار شاد و پرانرژی شدند.</p><h2>مناطق اصلی کشت قهوه در اتیوپی</h2><h3>یرگاچف (Yirgacheffe)</h3><p>مشهورترین منطقه قهوه اتیوپی. قهوه‌های یرگاچف با عطر گل یاسمن، طعم توت‌فرنگی و اسیدیته روشن شناخته می‌شوند. این قهوه‌ها معمولاً به روش Washed پردازش می‌شوند.</p><h3>سیدامو (Sidamo)</h3><p>منطقه‌ای وسیع با تنوع طعمی زیاد. قهوه‌های سیدامو می‌توانند طعم‌های میوه‌ای، گلی یا حتی شکلاتی داشته باشند.</p><h3>جیما (Jimma)</h3><p>قهوه‌های جیما معمولاً ارزان‌تر و با طعم‌های زمینی و ادویه‌ای هستند. بیشتر در مخلوط‌های تجاری استفاده می‌شوند.</p>`,
        category: originsCat._id,
        author:   admin._id,
        status:   "published",
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        readTime: 7,
        postType: "article",
        isFeatured: true,
        tags: ["اتیوپی", "تک‌خاستگاه", "تاریخ قهوه", "یرگاچف"],
        metaTitle: "قهوه اتیوپی؛ مهد قهوه جهان | کافه کوک",
        metaDescription: "با مناطق اصلی کشت قهوه در اتیوپی آشنا شوید. از یرگاچف تا سیدامو — هر منطقه طعم متفاوتی دارد.",
        viewCount: 218,
      },
      {
        title:    "بهترین آسیاب‌های قهوه خانگی ۱۴۰۳",
        slug:     "best-coffee-grinders-2024",
        excerpt:  "آسیاب قهوه مهم‌ترین تجهیزی است که کیفیت فنجان قهوه شما را تعیین می‌کند. ۵ آسیاب برتر را معرفی می‌کنیم.",
        content:  `<h2>چرا آسیاب قهوه اینقدر مهم است؟</h2><p>حتی بهترین دان قهوه هم با آسیاب نادرست خراب می‌شود. یکنواختی اندازه ذرات قهوه مستقیماً روی استخراج و طعم نهایی تأثیر می‌گذارد.</p><h2>انواع آسیاب</h2><h3>آسیاب پره‌ای (Blade Grinder)</h3><p>ارزان‌ترین گزینه. اما به دلیل آسیاب ناهموار، برای قهوه تخصصی توصیه نمی‌شود.</p><h3>آسیاب بر (Burr Grinder)</h3><p>انتخاب حرفه‌ای‌ها. دو نوع دارد: فلت‌بر (Flat Burr) و مخروطی (Conical Burr).</p><h2>پنج آسیاب برتر برای خانه</h2><ol><li><strong>Comandante C40</strong> — بهترین آسیاب دستی بازار</li><li><strong>Baratza Encore</strong> — بهترین برای مبتدیان</li><li><strong>Niche Zero</strong> — پرفروش‌ترین آسیاب تک‌دوز</li><li><strong>Timemore Chestnut C2</strong> — بهترین ارزش برای پول</li><li><strong>1Zpresso JX-Pro</strong> — بهترین دستی برای اسپرسو</li></ol>`,
        category: equipCat._id,
        author:   admin._id,
        status:   "published",
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        readTime: 6,
        postType: "product_review",
        isFeatured: false,
        tags: ["آسیاب قهوه", "تجهیزات", "راهنمای خرید"],
        metaTitle: "بهترین آسیاب قهوه خانگی ۱۴۰۳ | کافه کوک",
        metaDescription: "مقایسه ۵ آسیاب برتر برای قهوه خانگی. از آسیاب دستی تا برقی — هر چیزی که باید بدانید.",
        viewCount: 156,
      },
      {
        title:    "چطور با قهوه روز بهتری داشته باشیم؟",
        slug:     "coffee-better-day",
        excerpt:  "قهوه فقط یک نوشیدنی نیست — یک آیین است. چطور این آیین را به بهترین شکل تجربه کنیم؟",
        content:  `<h2>قهوه به عنوان یک آیین صبحگاهی</h2><p>مطالعات نشان می‌دهد که داشتن یک روتین صبحگاهی مشخص، از جمله دم‌کردن قهوه، می‌تواند سطح استرس را کاهش دهد و تمرکز را بهبود بخشد.</p><h2>بهترین زمان نوشیدن قهوه</h2><p>بر اساس تحقیقات علمی، بهترین زمان برای نوشیدن قهوه بین <strong>۹:۳۰ تا ۱۱:۳۰ صبح</strong> است — وقتی سطح کورتیزول طبیعی بدن کمی پایین‌تر از اوج صبحگاهی است.</p><h2>چند نکته برای لذت بیشتر از قهوه</h2><ul><li>قهوه را تازه آسیاب کنید</li><li>آب با کیفیت استفاده کنید</li><li>دمای صحیح را رعایت کنید (۹۲-۹۵ درجه)</li><li>از ظرف تمیز استفاده کنید</li><li>قهوه را بدون حواس‌پرتی بنوشید</li></ul>`,
        category: lifestyleCat._id,
        author:   admin._id,
        status:   "published",
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readTime: 4,
        postType: "article",
        isFeatured: false,
        tags: ["سبک زندگی", "قهوه صبحگاهی", "نکات قهوه"],
        metaTitle: "چطور با قهوه روز بهتری داشته باشیم | کافه کوک",
        metaDescription: "قهوه فقط کافئین نیست — یک تجربه است. بیاموزید چطور از هر فنجان قهوه بیشترین لذت را ببرید.",
        viewCount: 89,
      },
      {
        title:    "کولد برو در خانه؛ راهنمای گام به گام",
        slug:     "cold-brew-at-home",
        excerpt:  "کولد برو خانگی ساده‌تر از آنی است که فکر می‌کنید. با این راهنما، در ۱۲ ساعت یک کولد برو عالی آماده کنید.",
        content:  `<h2>کولد برو چیست؟</h2><p>کولد برو (Cold Brew) قهوه‌ای است که با آب سرد یا دمای اتاق، طی ۱۲ تا ۲۴ ساعت دم می‌کشد. نتیجه: قهوه‌ای شیرین، ملایم و با تلخی بسیار کم.</p><h2>چرا کولد برو؟</h2><ul><li>اسیدیته خیلی کمتر از قهوه معمولی</li><li>برای معده حساس مناسب‌تر است</li><li>تا ۲ هفته در یخچال نگه می‌ماند</li><li>می‌توان آن را بیشتر رقیق کرد</li></ul><h2>دستور ساخت کولد برو</h2><p><strong>نسبت:</strong> ۱۰۰ گرم قهوه به ازای ۱ لیتر آب</p><ol><li>قهوه را با آسیاب درشت آسیاب کنید</li><li>قهوه و آب سرد را در یک ظرف شیشه‌ای مخلوط کنید</li><li>هم بزنید تا همه قهوه خیس شود</li><li>در ظرف را ببندید و ۱۲-۲۴ ساعت در یخچال بگذارید</li><li>با یک صافی دو لایه صاف کنید</li><li>با یخ سرو کنید یا در بطری نگه دارید</li></ol>`,
        category: brewingCat._id,
        author:   admin._id,
        status:   "published",
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        readTime: 4,
        postType: "brewing_guide",
        isFeatured: false,
        tags: ["کولد برو", "آموزش", "تابستانی", "دم‌آوری سرد"],
        metaTitle: "کولد برو خانگی؛ راهنمای گام به گام | کافه کوک",
        metaDescription: "چطور در خانه کولد برو درست کنیم؟ راهنمای کامل با نسبت‌های دقیق و نکات حرفه‌ای.",
        viewCount: 201,
      },
    ]);
    console.log(`   ✅ ${posts.length} مقاله وبلاگ ایجاد شد\n`);

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
