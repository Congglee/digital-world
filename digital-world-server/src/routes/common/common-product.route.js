import { Router } from "express";
import productController from "../../controllers/product.controller";
import productMiddleware from "../../middleware/product.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import { wrapAsync } from "../../utils/response";

const commonProductRouter = Router();

commonProductRouter.get(
  "/get-products",
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(productController.getProducts)
);

commonProductRouter.get(
  "/get-all-products",
  productMiddleware.getAllProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(productController.getAllProducts)
);

commonProductRouter.get(
  "/get-product/:product_id",
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  wrapAsync(productController.getProduct)
);

commonProductRouter.get(
  "/search-product",
  wrapAsync(productController.searchProduct)
);

export default commonProductRouter;
