export const dynamic = "force-dynamic";

import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { registerSchema } from "@/validations/auth";
import { sendOtpEmail } from "@/lib/mail";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const POST = apiHandler(async (req) => {
  const body = await req.json();

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    const errors = parsed.error.errors.map((e) => e.message);
    return errorResponse(errors[0], 400, errors);
  }

  const { name, email, phone, password } = parsed.data;

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  }).lean();

  if (existingUser) {
    return errorResponse("این ایمیل قبلاً ثبت شده است", 409);
  }

  if (phone) {
    const existingPhone = await User.findOne({ phone }).lean();

    if (existingPhone) {
      return errorResponse("این شماره موبایل قبلاً ثبت شده است", 409);
    }
  }

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);

  await VerificationCode.deleteMany({
    email: normalizedEmail,
    type: "REGISTER",
  });

  await VerificationCode.create({
    email: normalizedEmail,
    codeHash,
    type: "REGISTER",
    data: {
      name,
      email: normalizedEmail,
      phone: phone || undefined,
      password,
    },
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(normalizedEmail, code, "REGISTER");

  return successResponse(
    { email: normalizedEmail },
    "کد تأیید به ایمیل شما ارسال شد"
  );
});