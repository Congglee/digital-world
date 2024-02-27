import mongoose, { Schema } from "mongoose";

// const VariantSchema = new Schema({
//   name: { type: String, required: true },
//   price: { type: Number, default: 0 },
//   quantity: { type: Number, default: 0 },
//   thumb: { type: String, required: true, maxlength: 1000 },
//   images: [{ type: String, maxlength: 1000 }],
// });

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    thumb: { type: String, required: true, maxlength: 1000 },
    images: [{ type: String, maxlength: 1000 }],
    overview: { type: String },
    description: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    price: { type: Number, default: 0 },
    price_before_discount: { type: Number, default: 0 },
    ratings: [
      {
        star: { type: Number },
        posted_by: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
        comment: { type: String },
        date: { type: Date, maxlength: 160 },
      },
    ],
    total_ratings: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    brand: { type: String, required: true },
    is_featured: { type: Boolean, default: false },
    is_published: { type: Boolean, default: true },
    // variants: [VariantSchema],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("products", ProductSchema);
