export const dynamic = "force-dynamic";

import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/apiHandler";
import { successResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { sendOtpEmail } from "@/lib/mail";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const POST = apiHandler(async (req) => {
  const { email } = await req.json();

  if (!email) {
    return successResponse(
      null,
      "اگر این ایمیل وجود داشته باشد، کد تأیید ارسال خواهد شد"
    );
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
    deletedAt: null,
  }).lean();

  // برای جلوگیری از email enumeration
  if (!user) {
    return successResponse(
      null,
      "اگر این ایمیل وجود داشته باشد، کد تأیید ارسال خواهد شد"
    );
  }

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);

  await VerificationCode.deleteMany({
    email: normalizedEmail,
    type: "FORGOT_PASSWORD",
  });

  await VerificationCode.create({
    email: normalizedEmail,
    codeHash,
    type: "FORGOT_PASSWORD",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(normalizedEmail, code, "FORGOT_PASSWORD");

  return successResponse(
    { email: normalizedEmail },
    "کد تأیید ارسال شد"
  );
});