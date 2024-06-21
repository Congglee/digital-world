import { body, query } from "express-validator";

const createPayPalOrderRules = () => {
  return [
    body("order_id")
      .exists({ checkFalsy: true })
      .withMessage("order_id không được để trống")
      .isMongoId()
      .withMessage("order_id không đúng định dạng"),
    body("total_amount")
      .exists({ checkFalsy: true })
      .withMessage("Tổng tiền không được để trống")
      .isNumeric()
      .withMessage("Tổng tiền không đúng định dạng"),
    body("order_code")
      .exists({ checkFalsy: true })
      .withMessage("Mã đơn hàng không được để trống")
      .isString()
      .withMessage("Mã đơn hàng không đúng định dạng"),
  ];
};

const paymentMiddleware = {
  createPayPalOrderRules,
};

export default paymentMiddleware;
