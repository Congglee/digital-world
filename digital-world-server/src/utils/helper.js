import * as dotenv from "dotenv";

dotenv.config();

export const isProduction =
  process.env.NODE_ENV === "production" || process.argv[2] === "production";

export const HOST = isProduction
  ? process.env.PRODUCTION_HOST
  : `http://${process.env.HOST}:${process.env.PORT}`;
