import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import productController from "../../controllers/product.controller";
import productMiddleware from "../../middleware/product.middleware";
import { wrapAsync } from "../../utils/response";
import reviewController from "../../controllers/review.controller";

const adminProductRouter = Router();

adminProductRouter.post(
  "/add-product",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  productMiddleware.addProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(productController.addProduct)
);

adminProductRouter.put(
  "/update-product/:product_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  productMiddleware.updateProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(productController.updateProduct)
);

adminProductRouter.delete(
  "/delete-product/:product_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  wrapAsync(productController.deleteProduct)
);

adminProductRouter.delete(
  "/delete-many-products",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.listIdRule("list_id"),
  helpersMiddleware.idValidator,
  wrapAsync(productController.deleteManyProducts)
);

adminProductRouter.delete(
  "/delete-user-rating/:product_id/:rating_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idRule("rating_id"),
  helpersMiddleware.idValidator,
  wrapAsync(reviewController.deleteUserRating)
);

adminProductRouter.delete(
  "/delete-many-ratings/:product_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.listIdRule("list_id"),
  helpersMiddleware.idValidator,
  wrapAsync(reviewController.deleteManyRatings)
);

adminProductRouter.put(
  "/update-rating-status/:product_id/:rating_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idRule("rating_id"),
  helpersMiddleware.idValidator,
  productMiddleware.updateRatingStatusRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(reviewController.updateRatingStatus)
);

export default adminProductRouter;
