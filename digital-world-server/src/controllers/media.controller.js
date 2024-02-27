import { responseSuccess } from "../utils/response";

const uploadImages = async (req, res) => {
  const images = req.files.map((file) => file.path);
  const uploadImages = [];
  for (const image of images) {
    uploadImages.push({ url: image });
  }
  const response = {
    message: "Upload ảnh thành công",
    data: uploadImages,
  };
  return responseSuccess(res, response);
};

const mediaController = { uploadImages };

export default mediaController;
