import { Router } from "express";
import mediaController from "../../controllers/media.controller";
import cloudinaryMiddleware from "../../middleware/cloudinary.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";

const commonMediaRouter = Router();

commonMediaRouter.post(
  "/upload-images",
  authMiddleware.verifyAccessToken,
  cloudinaryMiddleware.array("images", 10),
  wrapAsync(mediaController.uploadImages)
);

export default commonMediaRouter;
