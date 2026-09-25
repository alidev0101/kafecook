import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";
import VerificationCode from "@/models/VerificationCode";
import { sendOtpEmail } from "@/lib/mail";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const POST = apiHandler(async (req) => {
  const { email } = await req.json();

  if (!email) {
    return errorResponse("ایمیل الزامی است", 400);
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();

  const verification = await VerificationCode.findOne({
    email: normalizedEmail,
    type: "REGISTER",
  }).sort({ createdAt: -1 });

  if (!verification) {
    return errorResponse(
      "درخواست ثبت‌نام پیدا نشد. لطفاً دوباره ثبت‌نام کنید",
      404
    );
  }

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);

  verification.codeHash = codeHash;
  verification.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  verification.attempts = 0;

  await verification.save();

  await sendOtpEmail(normalizedEmail, code, "REGISTER");

  return successResponse(
    { email: normalizedEmail },
    "کد تأیید جدید ارسال شد"
  );
});