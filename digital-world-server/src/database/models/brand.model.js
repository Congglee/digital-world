import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    image: { type: String, maxlength: 1000 },
    is_actived: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BrandModel = mongoose.model("brands", BrandSchema);
