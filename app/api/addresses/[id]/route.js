import { apiHandler } from "@/lib/apiHandler";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import Address from "@/models/Address";
import { addressSchema } from "@/validations/order";

export const GET = apiHandler(
  async (req, { params }) => {
    const address = await Address.findOne({ _id: params.id, user: req.user.id }).lean();
    if (!address) return errorResponse("آدرس یافت نشد", 404);
    return successResponse(address);
  },
  { requireAuth: true }
);

export const PUT = apiHandler(
  async (req, { params }) => {
    const body = await req.json();
    const parsed = addressSchema.partial().safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return errorResponse(errors[0], 400);
    }

    const address = await Address.findOneAndUpdate(
      { _id: params.id, user: req.user.id },
      parsed.data,
      { new: true, runValidators: true }
    );
    if (!address) return errorResponse("آدرس یافت نشد", 404);
    return successResponse(address, "آدرس بروزرسانی شد");
  },
  { requireAuth: true }
);

export const DELETE = apiHandler(
  async (req, { params }) => {
    const address = await Address.findOneAndDelete({
      _id: params.id,
      user: req.user.id,
    });
    if (!address) return errorResponse("آدرس یافت نشد", 404);
    return successResponse(null, "آدرس حذف شد");
  },
  { requireAuth: true }
);
