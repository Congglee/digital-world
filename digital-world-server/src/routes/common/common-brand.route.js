import { Router } from "express";
import brandController from "../../controllers/brand.controller";
import brandMiddleware from "../../middleware/brand.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import { wrapAsync } from "../../utils/response";

const commonBrandRouter = Router();

commonBrandRouter.get(
  "/get-brands",
  brandMiddleware.getBrandsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.getBrands)
);

commonBrandRouter.get(
  "/get-all-brands",
  brandMiddleware.getBrandsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.getAllBrands)
);

commonBrandRouter.get(
  "/get-brand/:brand_id",
  helpersMiddleware.idRule("brand_id"),
  helpersMiddleware.idValidator,
  wrapAsync(brandController.getBrand)
);

export default commonBrandRouter;
