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
    body("order_phone")
      .exists({ checkFalsy: true })
      .withMessage("SDT không được để trống")
      .isLength({ max: 20 })
      .withMessage("SDT phải ít hơn 20 kí tự"),
    body("payment_method")
      .exists({ checkFalsy: true })
      .withMessage("Phương thức thanh toán không được để trống")
      .isLength({ max: 160 })
      .withMessage("Phương thức thanh toán phải ít hơn 160 kí tự"),
    body("delivery_at")
      .exists({ checkFalsy: true })
      .withMessage("Địa chỉ giao hàng không được để trống")
      .isLength({ max: 160 })
      .withMessage("Địa chỉ giao hàng phải ít hơn 160 kí tự"),
    body("products")
      .exists({ checkFalsy: true })
      .withMessage("Sản phẩm không được để trống")
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }
        if (value.length === 0) {
          return false;
        }
        return true;
      })
      .withMessage("Sản phẩm không đúng định dạng"),
  ];
};

const updateUserOrderRules = () => {
  return [
    body("order_status")
      .exists({ checkFalsy: true })
      .withMessage("Trạng thái đơn hàng không được để trống")
      .isLength({ max: 160 })
      .withMessage("Trạng thái đơn hàng phải ít hơn 160 kí tự"),
    body("delivery_status")
      .exists({ checkFalsy: true })
      .withMessage("Trạng thái vận chuyển không được để trống")
      .isLength({ max: 160 })
      .withMessage("Trạng thái vận chuyển phải ít hơn 160 kí tự"),
    body("payment_status")
      .exists({ checkFalsy: true })
      .withMessage("Trạng thái thanh toán không được để trống")
      .isLength({ max: 160 })
      .withMessage("Trạng thái thanh toán phải ít hơn 160 kí tự"),
  ];
};

const updateMyOrderRules = () => {
  return [
    body("order_status")
      .exists({ checkFalsy: true })
      .withMessage("Trạng thái đơn hàng không được để trống")
      .equals(ORDER_STATUS.CANCELLED)
      .withMessage(
        `Trạng thái đơn hàng chỉ chấp nhận giá trị là '${ORDER_STATUS.CANCELLED}'`
      ),
  ];
};

const orderMiddleware = {
  addOrderRules,
  updateUserOrderRules,
  updateMyOrderRules,
  getOrdersRules,
};

export default orderMiddleware;