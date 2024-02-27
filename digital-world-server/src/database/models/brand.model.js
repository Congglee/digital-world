import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema({ name: String }, { timestamps: true });

export const BrandModel = mongoose.model("brands", BrandSchema);
