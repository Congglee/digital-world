import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    brands: [{ type: Schema.Types.ObjectId, ref: "brands" }],
    is_actived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model("categories", CategorySchema);
