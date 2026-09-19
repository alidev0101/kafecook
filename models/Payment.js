import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "IRR",
    },
    gateway: {
      type: String,
      enum: ["zarinpal", "idpay", "parsian", "mellat", "cod", "test"],
      required: true,
    },
    gatewayLabel: String,
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    // Gateway response data
    authority: {
      type: String,
      default: null,
    },
    refId: {
      type: String,
      default: null,
    },
    cardNumber: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    // Raw gateway response (for logging)
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    failReason: {
      type: String,
      default: null,
    },
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ authority: 1 });
paymentSchema.index({ refId: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
