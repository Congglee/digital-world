import { body, query } from "express-validator";

const addBrandRules = () => {
  return [
    body("name")
      .trim()
      .exists({ checkFalsy: true })
      .withMessage("Tên thương hiệu không được để trống")
      .isString()
      .withMessage("Tên thương hiệu phải là kiểu string")
      .isLength({ max: 160 })
      .withMessage("Tên thương hiệu phải ít hơn 160 kí tự"),
    body("image")
      .if((value) => value !== undefined)
      .trim()
      .isString()
      .withMessage("Ảnh thương hiệu phải là kiểu string url")
      .isLength({ max: 1000 })
      .withMessage("Ảnh thương hiệu không được lớn hơn 1000 ký tự"),
    body("is_actived")
      .if((value) => value !== undefined)
      .isBoolean()
      .withMessage("Trạng thái kích hoạt phải là kiểu boolean"),
  ];
};

const updateBrandRules = () => {
  return addBrandRules();
};

const getBrandsRules = () => {
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

const brandMiddleware = {
  addBrandRules,
  getBrandsRules,
  updateBrandRules,
};

export default brandMiddleware;
