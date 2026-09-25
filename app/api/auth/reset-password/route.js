export const dynamic = "force-dynamic";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { resetPasswordSchema } from "@/validations/auth";

export const POST = apiHandler(async (req) => {
  const body = await req.json();

  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    const errors = parsed.error.errors.map((e) => e.message);
    return errorResponse(errors[0], 400, errors);
  }

  const { token, password } = parsed.data;

  if (!token) {
    return errorResponse("توکن تغییر رمز معتبر نیست", 400);
  }

  await connectDB();

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const verification = await VerificationCode.findOne({
    type: "FORGOT_PASSWORD",
    "data.resetTokenHash": tokenHash,
  });

  if (!verification) {
    return errorResponse("لینک تغییر رمز معتبر نیست", 400);
  }

  if (verification.expiresAt < new Date()) {
    await VerificationCode.deleteOne({ _id: verification._id });
    return errorResponse("زمان تغییر رمز به پایان رسیده است", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email: verification.email },
    { password: hashedPassword }
  );

  await VerificationCode.deleteOne({
    _id: verification._id,
  });

  return successResponse(null, "رمز عبور با موفقیت تغییر کرد");
});