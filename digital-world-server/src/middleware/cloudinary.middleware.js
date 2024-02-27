import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../constants/config";
import multer from "multer";
import { ErrorHandler } from "../utils/response";
import { STATUS } from "../constants/status";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowedFormats: ["jpeg", "png", "jpg", "webp"],
    folder: "digital-world",
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        STATUS.UNSUPPORTED_MEDIA_TYPE,
        "Kiểu file không hợp lệ. Chỉ cho chấp nhận các file JPEG, PNG, JPG và WEBP."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

export default upload;
