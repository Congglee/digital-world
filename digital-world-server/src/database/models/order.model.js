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
    order_by: {
      user_name: { type: String },
      user_email: { type: String },
      user_phone: { type: String },
      user_avatar: { type: String },
      user_id: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    },
    products: [
      {
        product_id: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
        product_name: { type: String },
        product_price: { type: Number },
        product_thumb: { type: String },
        buy_count: Number,
      },
    ],
    order_status: {
      type: String,
      default: ORDER_STATUS.IN_PROGRESS,
    },
    delivery_status: {
      type: String,
      default: DELIVERY_STATUS.WAIT_FOR_CONFIRMATION,
    },
    total_amount: { type: Number },
    payment_status: {
      type: String,
      default: PAYMENT_STATUS.UNPAID,
    },
    delivery_at: { type: String },
    date_of_order: { type: Date, maxlength: 160 },
    order_phone: { type: String, maxlength: 20 },
    order_note: { type: String },
    payment_method: {
      type: String,
      enum: [PAYMENT.DIRECTLY, PAYMENT.BANKING, PAYMENT.STRIPE_GATE],
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("orders", OrderSchema);
