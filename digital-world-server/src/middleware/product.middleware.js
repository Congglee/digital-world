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
      .withMessage("Tiêu đề không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tiêu đề phải ít hơn 160 kí tự"),
    body("thumb")
      .exists({ checkFalsy: true })
      .withMessage("Thumb không được để trống")
      .isLength({ max: 1000 })
      .withMessage("Thumb phải ít hơn 1000 kí tự"),
    body("images")
      .if((value) => value !== undefined)
      .isArray()
      .withMessage("Images phải dạng string[]"),
    body("category")
      .exists({ checkFalsy: true })
      .withMessage("Danh mục không được để trống")
      .isMongoId()
      .withMessage(`Danh mục không đúng định dạng id`),
    body("price")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Giá phải ở định dạng number"),
    body("price_before_discount")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Giá sau khi giảm phải ở định dạng number"),
    body("quantity")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("Số lượng phải ở định dạng number"),
    body("brand")
      // .exists({ checkFalsy: true })
      // .withMessage("Brand không được để trống")
      .isLength({ max: 160 })
      .withMessage("Brand phải ít hơn 160 kí tự"),
    body("is_featured")
      .exists()
      .withMessage("is_featured không được để trống")
      .isBoolean()
      .withMessage("is_featured không đúng định dạng"),
    body("is_published")
      .exists()
      .withMessage("is_published không được để trống")
      .isBoolean()
      .withMessage("is_published không đúng định dạng"),
  ];
};

const ratingProductRules = () => {
  return [
    body("star")
      .exists({ checkFalsy: true })
      .withMessage("Số sao không được để trống")
      .isNumeric()
      .withMessage("Số lượng phải ở định dạng number"),
    body("product_id")
      .exists({ checkFalsy: true })
      .withMessage("product_id không được để trống")
      .isMongoId()
      .withMessage(`product_id không đúng định dạng id`),
  ];
};

const updateProductRules = () => {
  return addProductRules();
};

const ProductMiddleware = {
  addProductRules,
  getProductsRules,
  getAllProductsRules,
  updateProductRules,
  ratingProductRules,
};

export default ProductMiddleware;
