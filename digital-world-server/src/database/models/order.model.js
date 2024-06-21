import mongoose, { Schema } from "mongoose";
import {
  ORDER_STATUS,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  PAYMENT,
} from "../../constants/purchase";

const OrderBySchema = new Schema({
  user_email: { type: String },
  user_avatar: { type: String },
  user_id: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
});

const OrderProductsSchema = new Schema({
  product_id: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
  product_name: { type: String },
  product_price: { type: Number },
  product_thumb: { type: String },
  buy_count: Number,
});

const ShippingAddressSchema = new Schema({
  order_fullname: { type: String, maxlength: 160 },
  order_phone: { type: String, maxlength: 20 },
  delivery_at: { type: String },
});

const OrderSchema = new Schema(
  {
    order_code: { type: String },
    order_by: { type: OrderBySchema },
    products: [OrderProductsSchema],
    order_status: {
      type: String,
      default: ORDER_STATUS.IN_PROGRESS,
    },
    delivery_status: {
      type: String,
      default: DELIVERY_STATUS.WAIT_FOR_CONFIRMATION,
    },
    total_amount: { type: Number },
    payment_status: { type: String, default: PAYMENT_STATUS.UNPAID },
    date_of_order: { type: Date, maxlength: 160 },
    shipping_address: { type: ShippingAddressSchema },
    order_note: { type: String },
    payment_method: {
      type: String,
      enum: [
        PAYMENT.DIRECTLY,
        PAYMENT.BANKING,
        PAYMENT.STRIPE_GATE_WAY,
        PAYMENT.PAYPAL_GATE_WAY,
      ],
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("orders", OrderSchema);
