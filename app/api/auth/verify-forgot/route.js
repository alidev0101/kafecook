export const dynamic = "force-dynamic";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";
import VerificationCode from "@/models/VerificationCode";

export const POST = apiHandler(async (req) => {
  const { email, code } = await req.json();

  if (!email || !code) {
    return errorResponse("ایمیل و کد تأیید الزامی است", 400);
  }

  await connectDB();

  const verification = await VerificationCode.findOne({
    email: email.toLowerCase().trim(),
    type: "FORGOT_PASSWORD",
  }).sort({ createdAt: -1 });

  if (!verification) {
    return errorResponse("کد تأیید یافت نشد یا منقضی شده است", 400);
  }

  if (verification.expiresAt < new Date()) {
    await VerificationCode.deleteOne({ _id: verification._id });
    return errorResponse("کد تأیید منقضی شده است", 400);
  }

  if (verification.attempts >= 5) {
    await VerificationCode.deleteOne({ _id: verification._id });
    return errorResponse("تعداد تلاش‌های شما بیش از حد مجاز است", 429);
  }

  const isValid = await bcrypt.compare(code, verification.codeHash);

  if (!isValid) {
    verification.attempts += 1;
    await verification.save();

    return errorResponse("کد تأیید اشتباه است", 400);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  verification.data = {
    resetTokenHash,
  };

  verification.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await verification.save();

  return successResponse(
    { token: resetToken },
    "کد تأیید شد"
  );
});