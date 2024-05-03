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

userProductRouter.delete(
  "/delete-rating/:product_id/:rating_id",
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idRule("rating_id"),
  helpersMiddleware.idValidator,
  wrapAsync(reviewController.deleteRating)
);

export default userProductRouter;
