import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "عنوان آدرس الزامی است"],
      trim: true,
      maxlength: [50, "عنوان نباید بیشتر از ۵۰ کاراکتر باشد"],
    },
    recipientName: {
      type: String,
      required: [true, "نام گیرنده الزامی است"],
      trim: true,
      maxlength: [60, "نام گیرنده نباید بیشتر از ۶۰ کاراکتر باشد"],
    },
    phone: {
      type: String,
      required: [true, "شماره تماس الزامی است"],
      match: [/^09[0-9]{9}$/, "شماره موبایل معتبر نیست"],
    },
    province: {
      type: String,
      required: [true, "استان الزامی است"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "شهر الزامی است"],
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      required: [true, "خیابان الزامی است"],
      trim: true,
    },
    alley: {
      type: String,
      trim: true,
    },
    buildingNumber: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "کد پستی الزامی است"],
      match: [/^[0-9]{10}$/, "کد پستی باید ۱۰ رقم باشد"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, "یادداشت نباید بیشتر از ۲۰۰ کاراکتر باشد"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

// Ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Virtual: full address string
addressSchema.virtual("fullAddress").get(function () {
  const parts = [
    this.province,
    this.city,
    this.district,
    this.street,
    this.alley,
    this.buildingNumber ? `پلاک ${this.buildingNumber}` : null,
    this.unit ? `واحد ${this.unit}` : null,
  ].filter(Boolean);
  return parts.join("، ");
});

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;
