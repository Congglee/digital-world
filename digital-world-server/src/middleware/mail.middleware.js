import { body } from "express-validator";

const sendNotifyMailRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("subject")
      .exists({ checkFalsy: true })
      .withMessage("Tiêu đề mail không được để trống"),
    body("content")
      .exists({ checkFalsy: true })
      .withMessage("Nội dung mail không được để trống"),
  ];
};

const mailMiddleware = { sendNotifyMailRules };

export default mailMiddleware;
