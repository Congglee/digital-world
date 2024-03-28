import { Router } from "express";
import { wrapAsync } from "../../utils/response";
import locationController from "../../controllers/location.controller";

const commonLocationRouter = Router();

commonLocationRouter.get(
  "/get-provinces",
  wrapAsync(locationController.getAllVNProvinces)
);

commonLocationRouter.get(
  "/get-province-districts/:province_id",
  wrapAsync(locationController.getProvinceDistrict)
);

commonLocationRouter.get(
  "/get-district-wards/:district_id",
  wrapAsync(locationController.getDistrictWards)
);

export default commonLocationRouter;
