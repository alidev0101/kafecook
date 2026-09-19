import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "کد تخفیف الزامی است"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "کد تخفیف باید حداقل ۳ کاراکتر باشد"],
      maxlength: [20, "کد تخفیف نباید بیشتر از ۲۰ کاراکتر باشد"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200],
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "نوع تخفیف الزامی است"],
    },
    value: {
      type: Number,
      required: [true, "مقدار تخفیف الزامی است"],
      min: [0, "مقدار تخفیف نمی‌تواند منفی باشد"],
    },
    // Percentage max cap
    maxDiscount: {
      type: Number,
      default: null,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUsageCount: {
      type: Number,
      default: null, // null = unlimited
    },
    maxUsagePerUser: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      },
    ],
    // Restrictions
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    specificUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ endDate: 1 });

// Virtual: isValid
couponSchema.virtual("isValid").get(function () {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.startDate && this.startDate > now) return false;
  if (this.endDate && this.endDate < now) return false;
  if (this.maxUsageCount && this.usedCount >= this.maxUsageCount) return false;
  return true;
});

// Virtual: typeLabel
couponSchema.virtual("typeLabel").get(function () {
  return this.type === "percentage" ? "درصدی" : "مبلغ ثابت";
});

// Method: calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.isValid) return 0;
  if (orderAmount < this.minOrderAmount) return 0;

  let discount = 0;
  if (this.type === "percentage") {
    discount = (orderAmount * this.value) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else {
    discount = this.value;
  }

  return Math.min(discount, orderAmount);
};

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;
