import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import ProductController from "../../controllers/product.controller";
import productMiddleware from "../../middleware/product.middleware";
import { wrapAsync } from "../../utils/response";

const adminProductRouter = Router();

adminProductRouter.post(
  "/add-product",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  productMiddleware.addProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.addProduct)
);

adminProductRouter.get(
  "/get-products",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getProducts)
);

adminProductRouter.get(
  "/get-all-products",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  productMiddleware.getAllProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getAllProducts)
);

adminProductRouter.get(
  "/get-product/:product_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.getProduct)
);

adminProductRouter.put(
  "/update-product/:product_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  productMiddleware.updateProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.updateProduct)
);

adminProductRouter.delete(
  "/delete-product/:product_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.deleteProduct)
);

adminProductRouter.delete(
  "/delete-many-products",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.listIdRule("list_id"),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.deleteManyProducts)
);

export default adminProductRouter;
