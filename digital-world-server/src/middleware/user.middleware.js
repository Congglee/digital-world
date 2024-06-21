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
      .isLength({ min: 6, max: 160 })
      .withMessage("Email phải từ 6-160 kí tự"),
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Tên không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tên phải ít hơn 160 kí tự"),
    body("password")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
    body("date_of_birth")
      .if((value) => value !== undefined)
      .isISO8601()
      .withMessage("Ngày sinh không đúng định dạng"),
    body("address")
      .if((value) => value !== undefined)
      .isLength({ max: 160 })
      .withMessage("Địa chỉ phải ít hơn 160 kí tự"),
    body("province")
      .if((value) => value !== undefined)
      .isLength({ max: 160 })
      .withMessage("Tỉnh phải ít hơn 160 kí tự"),
    body("district")
      .if((value) => value !== undefined)
      .isLength({ max: 160 })
      .withMessage("Quận huyện phải ít hơn 160 kí tự"),
    body("ward")
      .if((value) => value !== undefined)
      .isLength({ max: 160 })
      .withMessage("Phường phải ít hơn 160 kí tự"),
    body("phone")
      .if((value) => value !== undefined)
      .isLength({ max: 20 })
      .withMessage("SDT không được lớn hơn 20 kí tự"),
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
      .withMessage("Role không đúng định dạng"),
    body("avatar")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("avatar phải là string url")
      .isLength({ max: 1000 })
      .withMessage("URL avatar không được lớn hơn 1000 ký tự"),
    body("verify")
      .exists()
      .withMessage("Trạng thái xác thực tài khoản không được để trống")
      .isNumeric()
      .withMessage("Trạng thái xác thực tài khoản phải ở định dạng number"),
  ];
};

const updateUserRules = () => {
  return [
    body("name")
      .if((value) => value !== undefined)
      .exists({ checkFalsy: true })
      .withMessage("Tên không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tên phải ít hơn 160 kí tự"),
    body("date_of_birth")
      .if((value) => value !== undefined)
      .isISO8601()
      .withMessage("Ngày sinh không đúng định dạng"),
    body("address")
      .if((value) => value !== undefined)
      .isLength({ max: 160 })
      .withMessage("Địa chỉ phải ít hơn 160 kí tự"),
    body("phone")
      .if((value) => value !== undefined)
      .isLength({ max: 20 })
      .withMessage("SDT phải ít hơn 20 kí tự"),
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
      .withMessage("Role không đúng định dạng"),
    body("avatar")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Avatar phải là string url")
      .isLength({ max: 1000 })
      .withMessage("URL avatar không được lớn hơn 1000 ký tự"),
    body("password")
      .if((value) => value !== undefined)
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
    body("new_password")
      .if((value) => value !== undefined)
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu mới phải từ 6-160 kí tự"),
  ];
};

const updateMeRules = () => {
  return [
    body("name")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Tên phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Tên phải ít hơn 160 kí tự"),
    body("date_of_birth")
      .if((value) => value !== undefined)
      .isISO8601()
      .withMessage("Ngày sinh không đúng định dạng"),
    body("address")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Địa chỉ phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Địa chỉ phải ít hơn 160 kí tự"),
    body("province")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Tỉnh phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Tỉnh phải ít hơn 160 kí tự"),
    body("district")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Quận huyện phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Quận huyện phải ít hơn 160 kí tự"),
    body("ward")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Phường phải ở định dạng string")
      .isLength({ max: 160 })
      .withMessage("Phường phải ít hơn 160 kí tự"),
    body("phone")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("SDT phải ở định dạng string")
      .isLength({ max: 20 })
      .withMessage("SDT phải ít hơn 20 kí tự"),
    body("avatar")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Avatar phải là string url")
      .isLength({ max: 1000 })
      .withMessage("URL avatar không được lớn hơn 1000 ký tự"),
    body("password")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Mật khẩu phải ở định dạng string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
    body("new_password")
      .if((value) => value !== undefined)
      .isString()
      .withMessage("Mật khẩu mới phải ở định dạng string")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu mới phải từ 6-160 kí tự"),
  ];
};

const addToCartRules = () => {
  return [
    body("product_id")
      .exists({ checkFalsy: true })
      .withMessage("product_id không được để trống")
      .isMongoId()
      .withMessage("product_id không đúng định dạng"),
    body("buy_count")
      .exists({ checkFalsy: true })
      .withMessage("buy_count không được để trống")
      .custom((value) => {
        if (
          typeof value !== "number" ||
          value < 1 ||
          !Number.isInteger(value)
        ) {
          return false;
        }
        return true;
      })
      .withMessage("buy_count phải là số nguyên lớn hơn 0"),
  ];
};

const updateCartRules = () => {
  return addToCartRules();
};

const deleteProductsCartRules = () => {
  return [
    body()
      .isArray()
      .withMessage("body phải là array")
      .custom((value) => {
        if (value.length === 0) {
          return false;
        }
        return value.every((id) => isMongoId(id));
      })
      .withMessage("body phải là array id"),
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
