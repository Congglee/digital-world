import { body, query } from "express-validator";

const addBrandRules = () => {
  return [
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Tên thương hiệu không được để trống"),
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
