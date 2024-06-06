import mongoose, { Schema } from "mongoose";

const PaymentMethodSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    is_actived: { type: Boolean, default: true },
    image: { type: String, maxlength: 1000 },
    description: { type: String },
  },
  { timestamps: true }
);

export const PaymentMethodModel = mongoose.model(
  "payment_methods",
  PaymentMethodSchema
);
