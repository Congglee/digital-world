import { ROLE } from "../constants/role.enum";
import mongoose from "mongoose";

const REGEX_EMAIL =
  /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

const REGEX_MONGODB_ID = /^[a-f\d]{24}$/i;

export const isEmail = (email) => {
  return REGEX_EMAIL.test(email);
};

export const isAdmin = (req) => {
  return req.jwtDecoded?.roles?.includes(ROLE.ADMIN);
};

export const isMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && REGEX_MONGODB_ID.test(id);
};
