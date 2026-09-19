import { apiHandler } from "@/lib/apiHandler";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPagination,
  buildPaginationMeta,
} from "@/lib/apiResponse";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { reviewSchema } from "@/validations/product";

// GET /api/reviews?productId=xxx
export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) return errorResponse("شناسه محصول الزامی است", 400);

  const { page, limit, skip } = getPagination(searchParams.get("page"), 10);

  const filter = { product: productId, status: "approved" };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  // Rating stats
  const stats = await Review.aggregate([
    { $match: { product: require("mongoose").Types.ObjectId.createFromHexString(productId), status: "approved" } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
        dist: {
          $push: "$rating",
        },
      },
    },
  ]);

  return paginatedResponse(
    reviews,
    buildPaginationMeta(total, page, limit),
    "نظرات دریافت شد"
  );
});

// POST /api/reviews  (auth required)
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400, errors);
    }

    const { productId } = body;
    if (!productId) return errorResponse("شناسه محصول الزامی است", 400);

    // Check duplicate
    const existing = await Review.findOne({
      product: productId,
      user: req.user.id,
    });
    if (existing) return errorResponse("شما قبلاً برای این محصول نظر ثبت کرده‌اید", 409);

    // Check verified purchase
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      "items.product": productId,
      status: "delivered",
    }).lean();

    const review = await Review.create({
      ...parsed.data,
      product: productId,
      user: req.user.id,
      isVerifiedPurchase: !!hasPurchased,
      status: "pending",
    });

    return successResponse(review, "نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود", 201);
  },
  { requireAuth: true }
);
