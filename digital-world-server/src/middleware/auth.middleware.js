import { config } from "../constants/config";
import { verifyToken } from "../utils/jwt";
import { ROLE } from "../constants/role.enum";
import { responseError, ErrorHandler } from "../utils/response";
import { STATUS } from "../constants/status";
import { AccessTokenModel } from "../database/models/access-token.model";
import { RefreshTokenModel } from "../database/models/refresh-token.model";
import { body } from "express-validator";
import { UserModel } from "../database/models/user.model";

const verifyAccessToken = async (req, res, next) => {
  const access_token = req.headers.authorization?.replace("Bearer ", "");
  if (access_token) {
    try {
      const decoded = await verifyToken(access_token, config.SECRET_KEY);
      req.jwtDecoded = decoded;
      const accessTokenDB = await AccessTokenModel.findOne({
        token: access_token,
      }).exec();

      if (accessTokenDB) {
        return next();
      }
      return responseError(
        res,
        new ErrorHandler(STATUS.UNAUTHORIZED, "Không tồn tại token")
      );
    } catch (error) {
      return responseError(res, error);
    }
  }
  return responseError(
    res,
    new ErrorHandler(STATUS.UNAUTHORIZED, "Vui lòng đăng nhập")
  );
};

const verifyRefreshToken = async (req, res, next) => {
  const refresh_token = req.body.refresh_token;
  if (refresh_token) {
    try {
      const decoded = await verifyToken(refresh_token, config.SECRET_KEY);
      req.jwtDecoded = decoded;
      const refreshTokenDB = await RefreshTokenModel.findOne({
        token: refresh_token,
      }).exec();

      if (refreshTokenDB) {
        return next();
      }
      return responseError(
        res,
        new ErrorHandler(STATUS.UNAUTHORIZED, "Không tồn tại token")
      );
    } catch (error) {
      return responseError(res, error);
    }
  }
  return responseError(
    res,
    new ErrorHandler(STATUS.UNAUTHORIZED, "Vui lòng đăng nhập")
  );
};

const verifyAdmin = async (req, res, next) => {
  const userDB = await UserModel.findById(req.jwtDecoded.id).lean();
  if (userDB.roles.includes(ROLE.ADMIN)) {
    return next();
  }
  return responseError(
    res,
    new ErrorHandler(
      STATUS.FORBIDDEN,
      "Không có quyền truy cập hay chỉnh sửa tài nguyên này"
    )
  );
};

const verifyManagementAccess = (requiredRoles) => {
  return async (req, res, next) => {
    const user = await UserModel.findById(req.jwtDecoded.id).lean();
    if (requiredRoles.some((role) => user.roles.includes(role))) {
      return next();
    }
    return responseError(
      res,
      new ErrorHandler(
        STATUS.FORBIDDEN,
        "Không có quyền truy cập vào tài nguyên này"
      )
    );
  };
};

const registerRules = () => {
  return [
    body("name")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Họ và tên không được để trống")
      .isString()
      .withMessage("Họ và tên phải là kiểu string")
      .isLength({ min: 1, max: 160 })
      .withMessage("Họ và tên phải từ 1-160 kí tự"),
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("password")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Mật khẩu không được để trống")
      .isString()
      .withMessage("Mật khẩu phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
  ];
};

const loginRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("password")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Mật khẩu không được để trống")
      .isString()
      .withMessage("Mật khẩu phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
  ];
};

const forgotPasswordRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
  ];
};

const resetPasswordRules = () => {
  return [
    body("token")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Mã xác thực không được để trống"),
    body("password")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Mật khẩu không được để trống")
      .isString()
      .withMessage("Mật khẩu phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
  ];
};

const authMiddleware = {
  verifyAccessToken,
  verifyAdmin,
  registerRules,
  loginRules,
  verifyRefreshToken,
  forgotPasswordRules,
  resetPasswordRules,
  verifyManagementAccess,
};

export default authMiddleware;
