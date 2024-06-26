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
      .exists({ checkFalsy: true })
      .withMessage("Tên sản phẩm không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tên sản phẩm phải ít hơn 160 kí tự"),
    body("thumb")
      .exists({ checkFalsy: true })
      .withMessage("Ảnh đại diện không được để trống")
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
      .withMessage("Ảnh phải ở định dạng mảng string"),
    body("category")
      .exists({ checkFalsy: true })
      .withMessage("Danh mục không được để trống")
      .isMongoId()
      .withMessage("Danh mục phải là id"),
    body("price")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Giá phải ở định dạng number"),
    body("price_before_discount")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Giá gốc phải ở định dạng number"),
    body("quantity")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Số lượng phải ở định dạng number"),
    body("brand")
      .exists({ checkFalsy: true })
      .withMessage("Thương hiệu không được để trống")
      .isLength({ max: 160 })
      .withMessage("Thương hiệu phải ít hơn 160 kí tự"),
    body("overview")
      .exists({ checkFalsy: true })
      .withMessage("Thông số kỹ thuật không được để trống"),
    body("is_featured")
      .if((value) => value !== undefined)
      .isBoolean()
      .withMessage("Trạng thái nổi bật phải ở định dạng boolean"),
    body("is_actived")
      .if((value) => value !== undefined)
      .isBoolean()
      .withMessage("Trạng thái hiển thị phải ở định dạng boolean"),
  ];
};

const ratingProductRules = () => {
  return [
    body("star")
      .exists({ checkFalsy: true })
      .withMessage("Số sao không được để trống")
      .isNumeric()
      .withMessage("Số sao phải ở định dạng number"),
  ];
};

const updateRatingStatusRules = () => {
  return [
    body("publish")
      .exists()
      .withMessage("publish không được để trống")
      .isBoolean()
      .withMessage("publish không đúng định dạng"),
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
