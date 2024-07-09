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
    body("products")
      .exists({ checkFalsy: true })
      .withMessage("Sản phẩm không được để trống")
      .isArray()
      .withMessage("Sản phẩm phải là kiểu array")
      .custom((value) => {
        if (value.length === 0) {
          return false;
        }
        return true;
      })
      .withMessage("Sản phẩm không được để trống"),
    body("products.*._id")
      .exists({ checkFalsy: true })
      .withMessage("Id sản phẩm không được để trống")
      .isMongoId()
      .withMessage("Id sản phẩm phải là kiểu id"),
    body("products.*.name")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Tên sản phẩm không được để trống")
      .isString()
      .withMessage("Tên sản phẩm phải là kiểu string"),
    body("products.*.price")
      .exists({ checkFalsy: true })
      .withMessage("Giá sản phẩm không được để trống")
      .isNumeric()
      .withMessage("Giá sản phẩm phải là kiểu số"),
    body("products.*.thumb")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Ảnh sản phẩm không được để trống")
      .isString()
      .withMessage("Ảnh sản phẩm phải là kiểu string"),
    body("products.*.buy_count")
      .exists({ checkFalsy: true })
      .withMessage("Số lượng mua không được để trống")
      .isInt({ min: 0 })
      .withMessage("Số lượng mua phải là kiểu number số nguyên và lớn hơn 0"),
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
