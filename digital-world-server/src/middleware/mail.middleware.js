import { body } from "express-validator";

const sendNotifyMailRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("subject")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Tiêu đề mail không được để trống")
      .isString()
      .withMessage("Tiêu đề mail phải là kiểu string"),
    body("content")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Nội dung mail không được để trống")
      .isString()
      .withMessage("Nội dung mail phải là kiểu string"),
  ];
};

const sendCommonMailRules = () => {
  return sendNotifyMailRules();
};

const mailMiddleware = { sendNotifyMailRules, sendCommonMailRules };

export default mailMiddleware;
