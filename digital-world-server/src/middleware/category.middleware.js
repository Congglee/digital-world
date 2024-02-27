import { body, query } from "express-validator";

const addCategoryRules = () => {
  return [
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Tên danh mục không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tên phải ít hơn 160 kí tự"),
    body("brands")
      .exists({ checkFalsy: true })
      .withMessage("Thương hiệu không được để trống")
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }
        if (value.some((item) => typeof item !== "string")) {
          return false;
        }
        return true;
      })
      .withMessage("Thương hiệu không đúng định dạng"),
  ];
};

const updateCategoryRules = () => {
  return addCategoryRules();
};

const getCategoriesRules = () => {
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

const categoryMiddleware = {
  addCategoryRules,
  getCategoriesRules,
  updateCategoryRules,
};

export default categoryMiddleware;
