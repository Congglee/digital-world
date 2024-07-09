import { body, query } from "express-validator";

const addPaymentMethodRules = () => {
  return [
    body("name")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Tên phương thức thanh toán không được để trống")
      .isString()
      .withMessage("Tên phương thức thanh toán phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tên phương thức thanh toán phải ít hơn 160 kí tự"),
    body("is_actived")
      .if((value) => value !== undefined)
      .isBoolean()
      .withMessage("Trạng thái kích hoạt phải là kiểu boolean"),
  ];
};

const updatePaymentMethodRules = () => {
  return addPaymentMethodRules();
};

const getPaymentMethodsRules = () => {
  return [
    query("page")
      .if((value) => value !== undefined)
      .isInt()
      .withMessage("page không đúng định dạng"),
    query("limit")
      .if((value) => value !== undefined)
      .isInt()
      .withMessage("limit không đúng định dạng"),
    query("exclude")
      .if((value) => value !== undefined)
      .isMongoId()
      .withMessage("exclude không đúng định dạng"),
  ];
};

const paymentMethodMiddleware = {
  addPaymentMethodRules,
  getPaymentMethodsRules,
  updatePaymentMethodRules,
};

export default paymentMethodMiddleware;
