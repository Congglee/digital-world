import { body } from "express-validator";

const createPayPalOrderRules = () => {
  return [
    body("order_id")
      .exists({ checkFalsy: true })
      .withMessage("Đơn hàng không được để trống")
      .isMongoId()
      .withMessage("Đơn hàng phải là định dạng id"),
    body("total_amount")
      .exists({ checkFalsy: true })
      .withMessage("Tổng tiền không được để trống")
      .isNumeric()
      .withMessage("Tổng tiền phải là kiểu number"),
    body("order_code")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Mã đơn hàng không được để trống")
      .isString()
      .withMessage("Mã đơn hàng phải là kiểu string"),
  ];
};

const paymentMiddleware = {
  createPayPalOrderRules,
};

export default paymentMiddleware;
