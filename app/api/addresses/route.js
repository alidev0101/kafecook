import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Address from "@/models/Address";
import { addressSchema } from "@/validations/order";

// GET /api/addresses
export const GET = apiHandler(
  async (req) => {
    const addresses = await Address.find({ user: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();
    return successResponse(addresses);
  },
  { requireAuth: true }
);

// POST /api/addresses
export const POST = apiHandler(
  async (req) => {
    const body = await req.json();

    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400, errors);
    }

    // First address is default
    const count = await Address.countDocuments({ user: req.user.id });
    const isDefault = count === 0 ? true : parsed.data.isDefault;

    const address = await Address.create({
      ...parsed.data,
      user: req.user.id,
      isDefault,
    });

    return successResponse(address, "آدرس با موفقیت اضافه شد", 201);
  },
  { requireAuth: true }
);
