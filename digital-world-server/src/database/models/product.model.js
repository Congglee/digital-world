import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema({
  star: { type: Number, default: 0 },
  posted_by: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
  user_name: { type: String },
  user_avatar: { type: String },
  comment: { type: String },
  publish: { type: Boolean, default: true },
  date: { type: Date, maxlength: 160 },
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    thumb: { type: String, required: true, maxlength: 1000 },
    images: [{ type: String, maxlength: 1000 }],
    overview: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    price: { type: Number, default: 0 },
    price_before_discount: { type: Number, default: 0 },
    ratings: [RatingSchema],
    total_ratings: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    brand: { type: String, required: true, maxlength: 160 },
    is_actived: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("products", ProductSchema);
