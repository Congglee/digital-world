import { Router } from "express";
import categoryController from "../../controllers/category.controller";
import categoryMiddleware from "../../middleware/category.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import { wrapAsync } from "../../utils/response";

const commonCategoryRouter = Router();

commonCategoryRouter.get(
  "/",
  categoryMiddleware.getCategoriesRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.getCategories)
);

commonCategoryRouter.get(
  "/get-all-categories",
  categoryMiddleware.getCategoriesRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.getAllCategories)
);

commonCategoryRouter.get(
  "/get-category/:category_id",
  helpersMiddleware.idRule("category_id"),
  helpersMiddleware.idValidator,
  wrapAsync(categoryController.getCategory)
);

export default commonCategoryRouter;
