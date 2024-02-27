import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: String,
    brands: [{ type: String }],
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("categories", CategorySchema);
