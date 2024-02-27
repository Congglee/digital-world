import mongoose, { Schema } from "mongoose";
import {
  ORDER_STATUS,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  PAYMENT,
} from "../../constants/purchase";

const OrderSchema = new Schema(
  {
    order_code: { type: String },
    order_by: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
        buy_count: Number,
      },
    ],
    order_status: {
      type: Number,
      default: ORDER_STATUS.IN_PROGRESS,
    },
    delivery_status: {
      type: Number,
      default: DELIVERY_STATUS.WAIT_FOR_CONFIRMATION,
    },
    total_amount: { type: Number },
    payment_status: {
      type: Number,
      default: PAYMENT_STATUS.UNPAID,
    },
    delivery_at: { type: String },
    date_of_order: { type: Date, maxlength: 160 },
    order_phone: { type: String },
    payment_method: {
      type: Number,
      enum: [PAYMENT.DIRECTLY, PAYMENT.BANKING, PAYMENT.STRIPE_GATE],
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("orders", OrderSchema);