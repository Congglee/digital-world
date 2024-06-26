import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import categoryController from "../../controllers/category.controller";
import { wrapAsync } from "../../utils/response";
import categoryMiddleware from "../../middleware/category.middleware";

const adminCategoryRouter = Router();

adminCategoryRouter.post(
  "/add-category",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  categoryMiddleware.addCategoryRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.addCategory)
);

adminCategoryRouter.put(
  "/update-category/:category_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("category_id"),
  helpersMiddleware.idValidator,
  categoryMiddleware.updateCategoryRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.updateCategory)
);

adminCategoryRouter.delete(
  "/delete-category/:category_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("category_id"),
  helpersMiddleware.idValidator,
  wrapAsync(categoryController.deleteCategory)
);

adminCategoryRouter.delete(
  "/delete-many-categories",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.listIdRule("list_id"),
  helpersMiddleware.idValidator,
  wrapAsync(categoryController.deleteManyCategories)
);

export default adminCategoryRouter;
