import { body, query } from "express-validator";

const getProductsRules = () => {
  return [
    query("page")
      .if((value) => value !== undefined)
      .isInt()
      .withMessage("page không đúng định dạng"),
    query("limit")
      .if((value) => value !== undefined)
      .isInt()
      .withMessage("limit không đúng định dạng"),
    query("category")
      .if((value) => value !== undefined)
      .isMongoId()
      .withMessage("category không đúng định dạng"),
    query("exclude")
      .if((value) => value !== undefined)
      .isMongoId()
      .withMessage("exclude không đúng định dạng"),
  ];
};

const getAllProductsRules = () => {
  return [
    query("category")
      .if((value) => value !== undefined)
      .isMongoId()
      .withMessage("Danh mục không đúng định dạng"),
  ];
};

const addProductRules = () => {
  return [
    body("name")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Tên sản phẩm không được để trống")
      .isString()
      .withMessage("Tên sản phẩm phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tên sản phẩm phải ít hơn 160 kí tự"),
    body("thumb")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Ảnh đại diện không được để trống")
      .isString()
      .withMessage("Ảnh đại diện phải là kiểu string url")
      .isLength({ max: 1000 })
      .withMessage("Ảnh đại diện phải ít hơn 1000 kí tự"),
    body("images")
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
      .withMessage("Ảnh phải là kiểu string array"),
    body("category")
      .exists({ checkFalsy: true })
      .withMessage("Danh mục không được để trống")
      .isMongoId()
      .withMessage("Danh mục phải là định dạng id"),
    body("price")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Giá phải là kiểu number"),
    body("price_before_discount")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Giá gốc phải là kiểu number"),
    body("quantity")
      .if((value) => value !== undefined)
      .isInt({ min: 0 })
      .withMessage("Số lượng phải là kiểu number số nguyên và lớn hơn 0"),
    body("brand")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Thương hiệu không được để trống")
      .isString()
      .withMessage("Thương hiệu phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Thương hiệu phải ít hơn 160 kí tự"),
    body("overview")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Thông số kỹ thuật không được để trống")
      .isString()
      .withMessage("Thông số kỹ thuật phải là kiểu string"),
    body("is_featured")
      .if((value) => value !== undefined)
      .isBoolean()
      .withMessage("Trạng thái nổi bật phải là kiểu boolean"),
    body("is_actived")
      .if((value) => value !== undefined)
      .isBoolean()
      .withMessage("Trạng thái hiển thị phải là kiểu boolean"),
  ];
};

const ratingProductRules = () => {
  return [
    body("star")
      .exists({ checkFalsy: true })
      .withMessage("Số sao không được để trống")
      .isInt({ min: 0 })
      .withMessage("Số sao phải là kiểu number số nguyên và lớn hơn 0")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("Số sao phải từ 1 đến 5"),
  ];
};

const updateRatingStatusRules = () => {
  return [
    body("publish")
      .exists()
      .withMessage("Trạng thái hiển thị không được để trống")
      .isBoolean()
      .withMessage("Trạng thái hiển thị phải là kiểu boolean"),
  ];
};

const updateProductRules = () => {
  return addProductRules();
};

const productMiddleware = {
  addProductRules,
  getProductsRules,
  getAllProductsRules,
  updateProductRules,
  ratingProductRules,
  updateRatingStatusRules,
};

export default productMiddleware;
