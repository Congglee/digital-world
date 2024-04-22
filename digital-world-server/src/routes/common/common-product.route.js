import { Router } from "express";
import ProductController from "../../controllers/product.controller";
import productMiddleware from "../../middleware/product.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import { wrapAsync } from "../../utils/response";

const commonProductRouter = Router();

commonProductRouter.get(
  "/get-products",
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getProducts)
);

commonProductRouter.get(
  "/get-all-products",
  productMiddleware.getAllProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getAllProducts)
);

commonProductRouter.get(
  "/get-product/:product_id",
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.getProduct)
);

commonProductRouter.get(
  "/search-product",
  wrapAsync(ProductController.searchProduct)
);

export default commonProductRouter;
