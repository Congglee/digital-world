import { omit } from "lodash";
import { config } from "../constants/config";
import { ROLE } from "../constants/role.enum";
import { STATUS } from "../constants/status";
import { AccessTokenModel } from "../database/models/access-token.model";
import { RefreshTokenModel } from "../database/models/refresh-token.model";
import { UserModel } from "../database/models/user.model";
import {
  compareValue,
  generatePasswordResetToken,
  hashValue,
} from "../utils/crypto";
import { signToken } from "../utils/jwt";
import { ErrorHandler, responseSuccess } from "../utils/response";
import { generateOTP } from "../utils/utils";
import { VERIFY_STATUS } from "../constants/verify.enum";

const getExpire = (req) => {
  let expireAccessTokenConfig = Number(req.headers["expire-access-token"]);
  expireAccessTokenConfig = Number.isInteger(expireAccessTokenConfig)
    ? expireAccessTokenConfig
    : config.EXPIRE_ACCESS_TOKEN;
  let expireRefreshTokenConfig = Number(req.headers["expire-refresh-token"]);
  expireRefreshTokenConfig = Number.isInteger(expireRefreshTokenConfig)
    ? expireRefreshTokenConfig
    : config.EXPIRE_REFRESH_TOKEN;
  return {
    expireAccessTokenConfig,
    expireRefreshTokenConfig,
  };
};

const registerController = async (req, res) => {
  const form = req.body;
  const { email, password, name } = form;
  const userInDB = await UserModel.findOne({ email: email }).lean().exec();

  if (!userInDB) {
    const otpCode = generateOTP();
    const hashedPassword = hashValue(password);
    const emailEdited = `${btoa(email)}@${otpCode}`;
    const unVerifiedDeleteAt = new Date(Date.now() + 300000);

    const userAdd = await new UserModel({
      name,
      email: emailEdited,
      password: hashedPassword,
      unverified_delete_at: unVerifiedDeleteAt,
    }).save();

    if (userAdd) {
      const response = {
        message: "Vui lòng kiểm tra email của bạn để kích hoạt tài khoản",
        data: { otp_code: otpCode },
      };
      return responseSuccess(res, response);
    }
  }
  throw new ErrorHandler(STATUS.BAD_REQUEST, "Email đã tồn tại");
};

const finalRegisterController = async (req, res) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
  const { register_token } = req.params;
  const notActiveEmail = await UserModel.findOne({
    email: new RegExp(`${register_token}$`),
  }).exec();
  if (notActiveEmail) {
    notActiveEmail.email = atob(notActiveEmail.email.split("@")[0]);
    notActiveEmail.verify = VERIFY_STATUS.VERIFIED;
    notActiveEmail.unverified_delete_at = null;
    notActiveEmail.save();

    const payloadJWT = {
      email: notActiveEmail.email,
      id: notActiveEmail._id,
      roles: [ROLE.USER],
      created_at: new Date().toISOString(),
    };

    const access_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireAccessTokenConfig
    );
    const refresh_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireRefreshTokenConfig
    );

    await new AccessTokenModel({
      user_id: notActiveEmail._id,
      token: access_token,
    }).save();
    await new RefreshTokenModel({
      user_id: notActiveEmail._id,
      token: refresh_token,
    }).save();

    const response = {
      message: "Đăng ký tài khoản thành công, vui lòng đăng nhập",
      data: {
        access_token: "Bearer " + access_token,
        expires: config.EXPIRE_ACCESS_TOKEN,
        refresh_token,
        expires_refresh_token: expireRefreshTokenConfig,
        user: omit(notActiveEmail.toObject(), ["password", "__v"]),
      },
    };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(
    STATUS.BAD_REQUEST,
    "Mã xác thực tài khoản không hợp lệ"
  );
};

const loginController = async (req, res) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
  const form = req.body;
  const { email, password } = form;
  const userInDB = await UserModel.findOne({ email: email }).lean();
  if (!userInDB) {
    throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
      password: "Email hoặc password không đúng",
    });
  } else if (userInDB.verify === VERIFY_STATUS.BANNED) {
    throw new ErrorHandler(
      STATUS.NOT_ACCEPTABLE,
      "Tài khoản của bạn đã bị khóa, vui lòng liên hệ với quản trị viên"
    );
  } else {
    const match = compareValue(password, userInDB.password);
    if (!match) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: "Email hoặc password không đúng",
      });
    }

    const payloadJWT = {
      id: userInDB._id,
      email: userInDB.email,
      roles: userInDB.roles,
      created_at: new Date().toISOString(),
    };

    const access_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireAccessTokenConfig
    );
    const refresh_token = await signToken(
      payloadJWT,
      config.SECRET_KEY,
      expireRefreshTokenConfig
    );

    await new AccessTokenModel({
      user_id: userInDB._id,
      token: access_token,
    }).save();
    await new RefreshTokenModel({
      user_id: userInDB._id,
      token: refresh_token,
    }).save();

    const response = {
      message: "Đăng nhập thành công",
      data: {
        access_token: "Bearer " + access_token,
        expires: expireAccessTokenConfig,
        refresh_token,
        expires_refresh_token: expireRefreshTokenConfig,
        user: omit(userInDB, ["password", "__v"]),
      },
    };
    return responseSuccess(res, response);
  }
};

const refreshTokenController = async (req, res) => {
  const { expireAccessTokenConfig } = getExpire(req);
  const userDB = await UserModel.findById(req.jwtDecoded.id).lean().exec();
  if (userDB) {
    const payload = {
      id: userDB._id,
      email: userDB.email,
      roles: userDB.roles,
      created_at: new Date().toISOString(),
    };

    const access_token = await signToken(
      payload,
      config.SECRET_KEY,
      expireAccessTokenConfig
    );
    await new AccessTokenModel({
      user_id: req.jwtDecoded.id,
      token: access_token,
    }).save();

    const response = {
      message: "Refresh Token thành công",
      data: { access_token: "Bearer " + access_token },
    };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy người dùng");
};

const logoutController = async (req, res) => {
  const access_token = req.headers.authorization?.replace("Bearer ", "");
  await AccessTokenModel.findOneAndDelete({ token: access_token }).exec();
  return responseSuccess(res, { message: "Đăng xuất thành công" });
};

const forgotPasswordController = async (req, res) => {
  const form = req.body;
  const { email } = form;
  const userInDB = await UserModel.findOne({ email }).exec();
  if (userInDB) {
    const { resetToken, passwordResetExpires, passwordResetToken } =
      generatePasswordResetToken();
    userInDB.password_reset_token = passwordResetToken;
    userInDB.password_reset_expires = passwordResetExpires;
    await userInDB.save();

    const response = {
      message: "Vui lòng xác thực lấy lại mật khẩu trong email",
      data: { reset_password_token: resetToken },
    };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(STATUS.NOT_FOUND, "Email chưa được đăng ký");
};

const resetPasswordController = async (req, res) => {
  const form = req.body;
  const { token, password } = form;
  const passwordResetToken = hashValue(token);
  const userInDB = await UserModel.findOne({
    password_reset_token: passwordResetToken,
    password_reset_expires: { $gt: Date.now() },
  }).exec();
  if (userInDB) {
    userInDB.password = hashValue(password);
    userInDB.password_reset_token = "";
    userInDB.password_reset_expires = "";
    await userInDB.save();

    const response = { message: "Thay đổi mật khẩu thành công" };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(
    STATUS.BAD_REQUEST,
    "Reset password token không hợp lệ"
  );
};

const authController = {
  registerController,
  finalRegisterController,
  loginController,
  refreshTokenController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
};

export default authController;
