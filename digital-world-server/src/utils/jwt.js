import jwt from "jsonwebtoken";
import { STATUS } from "../constants/status";
import { ErrorHandler } from "../utils/response";

export const signToken = (payload, secret_key, token_life) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret_key, { expiresIn: token_life }, (error, token) => {
      if (error) {
        return reject(error);
      }
      resolve(token);
    });
  });
};

export const verifyToken = (token, secret_key) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret_key, (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          reject(
            new ErrorHandler(STATUS.UNAUTHORIZED, {
              message: "Token hết hạn",
              name: "EXPIRED_TOKEN",
            })
          );
        } else {
          reject(new ErrorHandler(STATUS.UNAUTHORIZED, "Token không đúng"));
        }
      }
      resolve(decoded);
    });
  });
};
