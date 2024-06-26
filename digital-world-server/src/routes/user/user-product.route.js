import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import productMiddleware from "../../middleware/product.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import reviewController from "../../controllers/review.controller";

const userProductRouter = Router();

userProductRouter.put(
  "/rating-product/:product_id",
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  productMiddleware.ratingProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(reviewController.ratingProduct)
);

userProductRouter.delete(
  "/delete-my-rating/:product_id/:rating_id",
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idRule("rating_id"),
  helpersMiddleware.idValidator,
  wrapAsync(reviewController.deleteMyRating)
);

export default userProductRouter;
