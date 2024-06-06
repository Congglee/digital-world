import { body, query } from "express-validator";

const addPaymentMethodRules = () => {
  return [
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Tên phương thức thanh toán không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tên phương thức thanh toán phải ít hơn 160 kí tự"),
    body("is_actived")
      .exists()
      .withMessage("is_actived không được để trống")
      .isBoolean()
      .withMessage("is_actived không đúng định dạng"),
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
