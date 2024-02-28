import { omit } from "lodash";
import { v4 as uuidv4 } from "uuid";
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
} from "../utils/crypt";
import { signToken } from "../utils/jwt";
import {
  generateRegistrationEmail,
  generateResetPasswordEmail,
  sendMail,
} from "../utils/mail.js";
import { ErrorHandler, responseSuccess } from "../utils/response";

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
  const body = req.body;
  const { email, password, name } = body;
  const userInDB = await UserModel.findOne({ email: email }).exec();

  if (!userInDB) {
    const token = uuidv4();
    const emailEdited = btoa(email) + "@" + token;
    const hashedPassword = hashValue(password);
    const userAdd = new UserModel({
      name,
      password: hashedPassword,
      email: emailEdited,
    }).save();

    if (userAdd) {
      const html = generateRegistrationEmail(token);
      await sendMail({
        email,
        html,
        subject: "Xác nhận đăng ký tài khoản Digital World 2",
      });
    }
    setTimeout(async () => {
      await UserModel.deleteOne({ email: emailEdited });
    }, [300000]);

    const response = {
      message: "Vui lòng kiểm tra email của bạn để kích hoạt tài khoản",
    };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(STATUS.BAD_REQUEST, "Email đã tồn tại");
};

const finalRegisterController = async (req, res) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
  const { token } = req.params;
  const notActiveEmail = await UserModel.findOne({
    email: new RegExp(`${token}$`),
  });
  if (notActiveEmail) {
    notActiveEmail.email = atob(notActiveEmail?.email?.split("@")[0]);
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
        user: omit(notActiveEmail, ["password"]),
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
  const body = req.body;
  const { email, password } = body;
  const userInDB = await UserModel.findOne({ email: email }).lean();
  if (!userInDB) {
    throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
      password: "Email hoặc password không đúng",
    });
  } else {
    const match = compareValue(password, userInDB.password);
    if (!match) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: "Email hoặc password không đúng",
      });
    }
    let payloadJWT = {
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
        user: omit(userInDB, ["password"]),
      },
    };
    return responseSuccess(res, response);
  }
};

const refreshTokenController = async (req, res) => {
  const { expireAccessTokenConfig } = getExpire(req);
  const userDB = await UserModel.findById(req.jwtDecoded.id).lean();
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
  throw new ErrorHandler(401, "Refresh Token không tồn tại");
};

const logoutController = async (req, res) => {
  const access_token = req.headers.authorization?.replace("Bearer ", "");
  await AccessTokenModel.findOneAndDelete({ token: access_token }).exec();
  return responseSuccess(res, { message: "Đăng xuất thành công" });
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const userInDB = await UserModel.findOne({ email });
  if (userInDB) {
    const { resetToken, passwordResetExpires, passwordResetToken } =
      generatePasswordResetToken();
    userInDB.password_reset_token = passwordResetToken;
    userInDB.password_reset_expires = passwordResetExpires;
    await userInDB.save();

    const html = generateResetPasswordEmail(resetToken);
    await sendMail({
      email,
      html,
      subject: "Quên mật khẩu",
    });

    const response = {
      message: "Vui lòng xác thực lấy lại mật khẩu trong email",
    };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(STATUS.NOT_FOUND, "Email chưa được đăng ký");
};

const resetPasswordController = async (req, res) => {
  const body = req.body;
  const { token, password } = body;
  const passwordResetToken = hashValue(token);
  const userInDB = await UserModel.findOne({
    password_reset_token: passwordResetToken,
    password_reset_expires: { $gt: Date.now() },
  });
  if (userInDB) {
    userInDB.password = hashValue(password);
    userInDB.password_reset_token = "";
    userInDB.password_reset_expires = "";
    await userInDB.save();

    const response = { message: "Thay đổi mật khẩu thành công" };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(STATUS.BAD_REQUEST, "Reset token không hợp lệ");
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
