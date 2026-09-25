export const dynamic = "force-dynamic";

import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export const POST = apiHandler(async (req) => {
  const { email, code } = await req.json();

  if (!email || !code) {
    return errorResponse("ایمیل و کد تأیید الزامی است", 400);
  }

  await connectDB();

  const verification = await VerificationCode.findOne({
    email: email.toLowerCase().trim(),
    type: "REGISTER",
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

  const userData = verification.data;

  const existingUser = await User.findOne({
    email: userData.email,
  });

  if (existingUser) {
    await VerificationCode.deleteOne({ _id: verification._id });
    return errorResponse("این ایمیل قبلاً ثبت شده است", 409);
  }

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    role: "USER",
    isActive: true,
  });

  await VerificationCode.deleteOne({ _id: verification._id });

  return successResponse(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    "ثبت‌نام با موفقیت انجام شد"
  );
});