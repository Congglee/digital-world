import mongoose, { Schema } from "mongoose";
import { ROLE } from "../../constants/role.enum";

const CartSchema = new Schema({
  product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
  buy_count: { type: Number },
  price: { type: Number, default: 0 },
  price_before_discount: { type: Number, default: 0 },
});

const UserSchema = new Schema(
  {
    name: { type: String, maxlength: 160 },
    email: { type: String, required: true, minlength: 5, maxlength: 160 },
    password: { type: String, required: true, minlength: 6, maxlength: 160 },
    date_of_birth: { type: Date, maxlength: 160 },
    address: { type: String, maxlength: 160 },
    province: { type: String, maxlength: 160 },
    district: { type: String, maxlength: 160 },
    ward: { type: String, maxlength: 160 },
    phone: { type: String, maxlength: 20 },
    roles: { type: [String], required: true, default: [ROLE.USER] },
    avatar: { type: String, maxlength: 1000 },
    cart: [CartSchema],
    is_blocked: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: "products" }],
    password_reset_token: { type: String },
    password_reset_expires: { type: String },

    unverified_delete_at: { type: Date }, // The field used for cronjob to delete users from the database when the registration email authentication has not been completed after 5 minutes
    is_email_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("users", UserSchema);
