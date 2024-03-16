import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import userController from "../../controllers/user.controller";
import { wrapAsync } from "../../utils/response";
import userMiddleware from "../../middleware/user.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";

const userUserRouter = Router();

userUserRouter.get(
  "/get-me",
  authMiddleware.verifyAccessToken,
  wrapAsync(userController.getDetailMySelf)
);

userUserRouter.put(
  "/update-me",
  authMiddleware.verifyAccessToken,
  userMiddleware.updateMeRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(userController.updateMe)
);

export default userUserRouter;
