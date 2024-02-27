import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

export const config = {
  SECRET_KEY: process.env.SECRET_KEY_JWT || "",
  EXPIRE_ACCESS_TOKEN: 7 * 24 * 60 * 60,
  EXPIRE_REFRESH_TOKEN: 100 * 24 * 60 * 60,
};
// 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const ROUTE_IMAGE = "images";

export default cloudinary;
