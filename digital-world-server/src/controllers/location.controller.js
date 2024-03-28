import { responseSuccess } from "../utils/response";

const VN_LOCATION_API_URL = "https://vapi.vnappmob.com/api/province";

const getAllVNProvinces = async (req, res) => {
  const response = await fetch(VN_LOCATION_API_URL);
  const provincesData = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả tỉnh thành công",
    data: provincesData,
  });
};

const getProvinceDistrict = async (req, res) => {
  const { province_id } = req.params;
  const response = await fetch(
    `${VN_LOCATION_API_URL}/district/${province_id}`
  );
  const districtData = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả quận huyện thành công",
    data: districtData,
  });
};

const getDistrictWards = async (req, res) => {
  const { district_id } = req.params;
  const response = await fetch(`${VN_LOCATION_API_URL}/ward/${district_id}`);
  const wardsData = await response.json();
  return responseSuccess(res, {
    message: "Lấy tất cả phường thành công",
    data: wardsData,
  });
};

const locationController = {
  getAllVNProvinces,
  getProvinceDistrict,
  getDistrictWards,
};

export default locationController;
