import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import productController from "../../controllers/product.controller";
import { wrapAsync } from "../../utils/response";
import productMiddleware from "../../middleware/product.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";

const userProductRouter = Router();

userProductRouter.put(
  "/rating-product",
  authMiddleware.verifyAccessToken,
  productMiddleware.ratingProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(productController.ratingProduct)
);

export default userProductRouter;
