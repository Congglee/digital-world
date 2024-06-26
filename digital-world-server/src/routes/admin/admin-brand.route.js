import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import brandController from "../../controllers/brand.controller";
import { wrapAsync } from "../../utils/response";
import brandMiddleware from "../../middleware/brand.middleware";

const adminBrandRouter = Router();

adminBrandRouter.get(
  "/get-all-brands",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  brandMiddleware.getBrandsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.getAllBrands)
);

adminBrandRouter.post(
  "/add-brand",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  brandMiddleware.addBrandRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(brandController.addBrand)
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

adminBrandRouter.delete(
  "/delete-many-brands",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.listIdRule("list_id"),
  helpersMiddleware.idValidator,
  wrapAsync(brandController.deleteManyBrands)
);

export default adminBrandRouter;
