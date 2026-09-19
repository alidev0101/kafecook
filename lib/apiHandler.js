import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { errorResponse } from "./apiResponse";
import connectDB from "./mongodb";

/**
 * Wraps an API route handler with:
 * - DB connection
 * - Error handling
 * - Optional auth check
 * - Optional admin check
 */
export function apiHandler(handler, options = {}) {
  const { requireAuth = false, requireAdmin = false } = options;

  return async function (req, context) {
    try {
      await connectDB();

      if (requireAuth || requireAdmin) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
          return errorResponse("لطفاً وارد حساب کاربری خود شوید", 401);
        }

        if (requireAdmin && session.user.role !== "ADMIN") {
          return errorResponse("دسترسی غیرمجاز", 403);
        }

        req.user = session.user;
      }

      return await handler(req, context);
    } catch (error) {
      console.error("API Error:", error);

      // Mongoose validation error
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return errorResponse(errors[0], 400, errors);
      }

      // Mongoose duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const fieldLabels = {
          email: "ایمیل",
          phone: "شماره موبایل",
          slug: "slug",
          code: "کد تخفیف",
          name: "نام",
        };
        return errorResponse(
          `${fieldLabels[field] || field} قبلاً ثبت شده است`,
          409
        );
      }

      // Cast error (invalid ObjectId)
      if (error.name === "CastError") {
        return errorResponse("شناسه نامعتبر است", 400);
      }

      // Custom auth errors
      if (error.message === "UNAUTHORIZED") {
        return errorResponse("لطفاً وارد حساب کاربری خود شوید", 401);
      }

      if (error.message === "FORBIDDEN") {
        return errorResponse("دسترسی غیرمجاز", 403);
      }

      return errorResponse("خطای داخلی سرور", 500);
    }
  };
}
