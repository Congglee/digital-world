import mongoose, { Schema } from "mongoose";
import {
  ORDER_STATUS,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  PAYMENT,
} from "../../constants/purchase";

const OrderBySchema = new Schema({
  user_fullname: { type: String, maxlength: 160 },
  user_phone: { type: String, maxlength: 20 },
  user_email: { type: String, maxlength: 160 },
  user_avatar: { type: String, maxlength: 1000 },
  user_id: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
});

const OrderProductsSchema = new Schema({
  product_id: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
  product_name: { type: String, maxlength: 160 },
  product_price: { type: Number, default: 0 },
  product_thumb: { type: String, maxlength: 1000 },
  buy_count: Number,
});

const AddressSchema = new Schema({
  address: { type: String, required: true },
  province: { type: String, maxlength: 160 },
  district: { type: String, maxlength: 160 },
  ward: { type: String, maxlength: 160 },
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
    total_amount: { type: Number, default: 0 },
    payment_status: { type: String, default: PAYMENT_STATUS.UNPAID },
    date_of_order: { type: Date },
    shipping_address: { type: AddressSchema },
    billing_address: { type: AddressSchema },
    order_note: { type: String },
    payment_method: {
      type: String,
      default: PAYMENT.DIRECTLY,
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
