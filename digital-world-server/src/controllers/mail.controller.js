import { STATUS } from "../constants/status";
import { UserModel } from "../database/models/user.model";
import { sendMail } from "../utils/mail";
import { ErrorHandler, responseSuccess } from "../utils/response";

const sendNotifyMail = async (req, res) => {
  const form = req.body;
  const { email, content, subject } = form;
  const userInDB = await UserModel.findOne({ email: email }).exec();
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
  }
  throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy người dùng");
};

const mailController = {
  sendNotifyMail,
};

export default mailController;
