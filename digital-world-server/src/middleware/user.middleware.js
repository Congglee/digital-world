import { body, query } from "express-validator";
import { isMongoId } from "../utils/validate";

const getUsersRules = () => {
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

const addUserRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("name")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Họ và tên không được để trống")
      .isString()
      .withMessage("Họ và tên phải là string")
      .isLength({ max: 160 })
      .withMessage("Họ và tên phải ít hơn 160 kí tự"),
    body("password")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Mật khẩu không được để trống")
      .isString()
      .withMessage("Mật khẩu phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
    body("date_of_birth")
      .if((value) => value !== undefined)
      .isISO8601()
      .withMessage("Ngày sinh phải ở định dạng ISO8601"),
    body("address")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Địa chỉ phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Địa chỉ phải ít hơn 160 kí tự"),
    body("province")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Tỉnh phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tỉnh phải ít hơn 160 kí tự"),
    body("district")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Quận huyện phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Quận huyện phải ít hơn 160 kí tự"),
    body("ward")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Phường phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Phường phải ít hơn 160 kí tự"),
    body("phone")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Số điện thoại phải là kiểu string")
      .isLength({ max: 20 })
      .withMessage("Số điện thoại phải ít hơn 20 kí tự"),
    body("roles")
      .exists({ checkFalsy: true })
      .withMessage("Phân quyền không được để trống")
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }
        if (value.some((item) => typeof item !== "string")) {
          return false;
        }
        return true;
      })
      .withMessage("Role phải là kiểu string array"),
    body("avatar")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Avatar phải là kiểu string url")
      .isLength({ max: 1000 })
      .withMessage("Url avatar không được lớn hơn 1000 ký tự"),
    body("verify")
      .exists()
      .withMessage("Trạng thái xác thực tài khoản không được để trống")
      .isInt()
      .withMessage("Trạng thái xác thực tài khoản phải là kiểu number"),
  ];
};

const updateUserRules = () => {
  return [
    body("name")
      .if((value) => value !== undefined)
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Họ và tên không được để trống")
      .isString()
      .withMessage("Họ và tên phải là string")
      .isLength({ max: 160 })
      .withMessage("Họ và tên phải ít hơn 160 kí tự"),
    body("date_of_birth")
      .if((value) => value !== undefined)
      .isISO8601()
      .withMessage("Ngày sinh phải ở định dạng ISO8601"),
    body("address")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Địa chỉ phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Địa chỉ phải ít hơn 160 kí tự"),
    body("province")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Tỉnh phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tỉnh phải ít hơn 160 kí tự"),
    body("district")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Quận huyện phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Quận huyện phải ít hơn 160 kí tự"),
    body("ward")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Phường phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Phường phải ít hơn 160 kí tự"),
    body("phone")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Số điện thoại phải là kiểu string")
      .isLength({ max: 20 })
      .withMessage("Số điện thoại phải ít hơn 20 kí tự"),
    body("roles")
      .if((value) => value !== undefined)
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }
        if (value.some((item) => typeof item !== "string")) {
          return false;
        }
        return true;
      })
      .withMessage("Role phải là kiểu string array"),
    body("avatar")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Avatar phải là kiểu string url")
      .isLength({ max: 1000 })
      .withMessage("Url avatar không được lớn hơn 1000 ký tự"),
    body("password")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Mật khẩu phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
    body("new_password")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Mật khẩu mới phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu mới phải từ 6-160 kí tự"),
  ];
};

const updateMeRules = () => {
  return [
    body("name")
      .if((value) => value !== undefined)
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Họ và tên không được để trống")
      .isString()
      .withMessage("Họ và tên phải là string")
      .isLength({ max: 160 })
      .withMessage("Họ và tên phải ít hơn 160 kí tự"),
    body("date_of_birth")
      .if((value) => value !== undefined)
      .isISO8601()
      .withMessage("Ngày sinh phải ở định dạng ISO8601"),
    body("address")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Địa chỉ phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Địa chỉ phải ít hơn 160 kí tự"),
    body("province")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Tỉnh phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tỉnh phải ít hơn 160 kí tự"),
    body("district")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Quận huyện phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Quận huyện phải ít hơn 160 kí tự"),
    body("ward")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Phường phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Phường phải ít hơn 160 kí tự"),
    body("phone")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Số điện thoại phải là kiểu string")
      .isLength({ max: 20 })
      .withMessage("Số điện thoại phải ít hơn 20 kí tự"),
    body("avatar")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Avatar phải là kiểu string url")
      .isLength({ max: 1000 })
      .withMessage("Url avatar không được lớn hơn 1000 ký tự"),
    body("password")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Mật khẩu phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
    body("new_password")
      .if((value, { req }) => value !== undefined || req.body.password)
      .trim()
      .isString()
      .withMessage("Mật khẩu mới phải là kiểu string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu mới phải từ 6-160 kí tự"),
  ];
};

const addToCartRules = () => {
  return [
    body("product_id")
      .exists({ checkFalsy: true })
      .withMessage("Sản phẩm không được để trống")
      .isMongoId()
      .withMessage("Sản phẩm phải là định dạng id"),
    body("buy_count")
      .exists({ checkFalsy: true })
      .withMessage("Số lượng mua không được để trống")
      .isInt({ min: 1 })
      .withMessage("Số lượng mua phải là kiểu number và lớn hơn 0"),
  ];
};

const updateCartRules = () => {
  return addToCartRules();
};

const deleteProductsCartRules = () => {
  return [
    body()
      .custom((value) => {
        if (value.length === 0) {
          return false;
        }
        return value.every((id) => isMongoId(id));
      })
      .withMessage("body phải là kiểu id array"),
  ];
};

const userMiddleware = {
  addUserRules,
  updateMeRules,
  getUsersRules,
  updateUserRules,
  addToCartRules,
  updateCartRules,
  deleteProductsCartRules,
};

export default userMiddleware;
