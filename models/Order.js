import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  comparePrice: {
    type: Number,
    default: null,
  },
  // Snapshot
  productSnapshot: {
    name: { type: String, required: true },
    image: String,
    slug: String,
    weightLabel: String,
    grindLabel: String,
    sku: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    // Shipping address snapshot
    shippingAddress: {
      recipientName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      district: String,
      street: { type: String, required: true },
      alley: String,
      buildingNumber: String,
      unit: String,
      postalCode: { type: String, required: true },
      notes: String,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "pickup"],
      default: "standard",
    },
    shippingMethodLabel: {
      type: String,
      default: "ارسال معمولی",
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      default: "online",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500],
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    trackingCode: {
      type: String,
      trim: true,
    },
    // Status history
    statusHistory: [
      {
        status: String,
        note: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Auto generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.orderNumber = `KC-${year}${month}${day}-${random}`;
  }
  next();
});

// Virtual: items count
orderSchema.virtual("itemsCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Status label virtual
orderSchema.virtual("statusLabel").get(function () {
  const labels = {
    pending: "در انتظار تأیید",
    processing: "در حال پردازش",
    shipped: "ارسال شده",
    delivered: "تحویل داده شده",
    cancelled: "لغو شده",
    refunded: "مسترد شده",
  };
  return labels[this.status] || this.status;
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
