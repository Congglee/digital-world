import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import brandController from "../../controllers/brand.controller";
import { wrapAsync } from "../../utils/response";
import brandMiddleware from "../../middleware/brand.middleware";

const adminBrandRouter = Router();

adminBrandRouter.get(
  "/get-brands",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  brandMiddleware.getBrandsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.getBrands)
);

adminBrandRouter.post(
  "/add-brand",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  brandMiddleware.addBrandRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.addBrand)
);

adminBrandRouter.get(
  "/get-brand/:brand_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("brand_id"),
  helpersMiddleware.idValidator,
  wrapAsync(brandController.getBrand)
);

adminBrandRouter.put(
  "/update-brand/:brand_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("brand_id"),
  helpersMiddleware.idValidator,
  brandMiddleware.updateBrandRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.updateBrand)
);

adminBrandRouter.delete(
  "/delete-brand/:brand_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("brand_id"),
  helpersMiddleware.idValidator,
  wrapAsync(brandController.deleteBrand)
);

export default adminBrandRouter;
