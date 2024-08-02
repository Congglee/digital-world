import { body, query } from "express-validator";
import { ORDER_STATUS } from "../constants/purchase";

const getOrdersRules = () => {
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

const addOrderRules = () => {
  return [
    body("user_fullname")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Họ và tên không được để trống")
      .isString()
      .withMessage("Họ và tên phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Họ và tên phải ít hơn 160 kí tự"),
    body("user_phone")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Số điện thoại không được để trống")
      .isString()
      .withMessage("Số điện thoại phải là kiểu string")
      .isLength({ max: 20 })
      .withMessage("Số điện thoại phải ít hơn 20 kí tự"),
    body("order_note")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Ghi chú phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Ghi chú phải ít hơn 160 kí tự"),
    body("payment_method")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Phương thức thanh toán không được để trống")
      .isLength({ max: 160 })
      .withMessage("Phương thức thanh toán phải ít hơn 160 kí tự"),
    body("shipping_address")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Địa chỉ giao hàng không được để trống")
      .isString()
      .withMessage("Địa chỉ giao hàng phải là kiểu string"),
    body("shipping_province")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Tỉnh giao hàng không được để trống")
      .isString()
      .withMessage("Tỉnh giao hàng phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tỉnh giao hàng phải ít hơn 160 kí tự"),
    body("shipping_district")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Quận huyện giao hàng không được để trống")
      .isString()
      .withMessage("Quận huyện giao hàng phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Quận huyện giao hàng phải ít hơn 160 kí tự"),
    body("shipping_ward")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Phường giao hàng phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Phường giao hàng phải ít hơn 160 kí tự"),
    body("billing_address")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Địa chỉ thanh toán phải là kiểu string"),
    body("billing_province")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Tỉnh thanh toán phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tỉnh thanh toán phải ít hơn 160 kí tự"),
    body("billing_district")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Quận huyện thanh toán phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Quận huyện thanh toán phải ít hơn 160 kí tự"),
    body("billing_ward")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Phường thanh toán phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Phường thanh toán phải ít hơn 160 kí tự"),
  ];
};

const updateMyOrderRules = () => {
  return [
    body("order_status")
      .equals(ORDER_STATUS.CANCELLED)
      .withMessage(
        `Trạng thái đơn hàng chỉ chấp nhận giá trị là '${ORDER_STATUS.CANCELLED}'`
      ),
  ];
};

const orderMiddleware = {
  addOrderRules,
  updateMyOrderRules,
  getOrdersRules,
};

export default orderMiddleware;
