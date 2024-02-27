import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import userController from "../../controllers/user.controller";
import { wrapAsync } from "../../utils/response";

const commonUserRouter = Router();

commonUserRouter.get(
  "/get-me",
  authMiddleware.verifyAccessToken,
  wrapAsync(userController.getDetailMySelf)
);

export default commonUserRouter;
