import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: String,
    brands: [{ type: Schema.Types.ObjectId, ref: "brands" }],
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("categories", CategorySchema);
