import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import productMiddleware from "../../middleware/product.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import reviewController from "../../controllers/review.controller";

const userProductRouter = Router();

userProductRouter.put(
  "/rating-product",
  authMiddleware.verifyAccessToken,
  productMiddleware.ratingProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(reviewController.ratingProduct)
);

export default userProductRouter;
