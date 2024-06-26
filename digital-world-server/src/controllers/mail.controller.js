import { STATUS } from "../constants/status";
import { UserModel } from "../database/models/user.model";
import { sendMail } from "../utils/mail";
import { ErrorHandler, responseSuccess } from "../utils/response";

const sendNotifyMail = async (req, res) => {
  const form = req.body;
  const { email, content, subject } = form;
  const userInDB = await UserModel.findOne({ email: email }).lean();
  if (userInDB) {
    await sendMail({
      email,
      html: content,
      subject,
    });
    const response = {
      message: "Đã gửi mail thông báo đến người dùng thành công",
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy người dùng");
  }
};

const sendCommonMail = async (req, res) => {
  const form = req.body;
  const { email, content, subject } = form;
  await sendMail({ email, html: content, subject });
  const response = { message: "Đã gửi mail đến người dùng thành công" };
  return responseSuccess(res, response);
};

const mailController = {
  sendNotifyMail,
  sendCommonMail,
};

export default mailController;
