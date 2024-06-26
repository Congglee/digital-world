import { Router } from "express";
import { wrapAsync } from "../../utils/response";
import locationController from "../../controllers/location.controller";

const commonLocationRouter = Router();

commonLocationRouter.get(
  "/get-provinces",
  wrapAsync(locationController.getAllProvinces)
);

commonLocationRouter.get(
  "/get-province-districts/:province_id",
  wrapAsync(locationController.getProvinceDistricts)
);

commonLocationRouter.get(
  "/get-district-wards/:district_id",
  wrapAsync(locationController.getDistrictWards)
);

commonLocationRouter.get(
  "/get-address-autocomplete",
  wrapAsync(locationController.getAddressAutocomplete)
);

export default commonLocationRouter;
