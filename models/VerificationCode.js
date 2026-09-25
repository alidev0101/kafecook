import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    type: { type: String, enum: ["REGISTER", "FORGOT_PASSWORD"], required: true },
    data: { type: Object, default: null },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.VerificationCode ||
  mongoose.model("VerificationCode", verificationCodeSchema);