import { responseSuccess } from "../utils/response";
import * as dotenv from "dotenv";

dotenv.config();

const GEOAPIFY_GEOCODING_API_URL = "https://api.geoapify.com/v1/geocode";

const getAllProvinces = async (req, res) => {
  const response = await fetch(`${process.env.VN_LOCATION_API_URL}/provinces`);
  const provinces = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả tỉnh thành thành công",
    data: { results: provinces },
  });
};

const getProvinceDistricts = async (req, res) => {
  const { province_id } = req.params;
  const response = await fetch(
    `${process.env.VN_LOCATION_API_URL}/districts/?province_id=${province_id}`
  );
  const districts = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả quận huyện thành công",
    data: { results: districts },
  });
};

const getDistrictWards = async (req, res) => {
  const { district_id } = req.params;
  const response = await fetch(
    `${process.env.VN_LOCATION_API_URL}/wards/?district_id=${district_id}`
  );
  const wards = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả phường xã thành công",
    data: { results: wards },
  });
};

const getAddressAutocomplete = async (req, res) => {
  const { search_text } = req.query;
  const response = await fetch(
    `${GEOAPIFY_GEOCODING_API_URL}/autocomplete?text=${search_text}&lang=vi&format=json&apiKey=${process.env.GEOAPIFY_TOKEN}`
  );
  const addressAutoCompleteData = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả địa chỉ thành công",
    data: addressAutoCompleteData,
  });
};

const locationController = {
  getAllProvinces,
  getProvinceDistricts,
  getDistrictWards,
  getAddressAutocomplete,
};

export default locationController;
