import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import User from "@/models/User";
import { registerSchema } from "@/validations/auth";

export const POST = apiHandler(async (req) => {
  const body = await req.json();

  // Validate
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.errors.map((e) => e.message);
    return errorResponse(errors[0], 400, errors);
  }

  const { name, email, phone, password } = parsed.data;

  // Check if email already exists
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return errorResponse("این ایمیل قبلاً ثبت شده است", 409);
  }

  // Check phone uniqueness if provided
  if (phone) {
    const existingPhone = await User.findOne({ phone }).lean();
    if (existingPhone) {
      return errorResponse("این شماره موبایل قبلاً ثبت شده است", 409);
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone: phone || undefined,
    password,
    role: "USER",
  });

  return successResponse(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    "ثبت‌نام با موفقیت انجام شد",
    201
  );
});
