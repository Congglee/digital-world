import { Router } from "express";
import authController from "../../controllers/auth.controller";
import authMiddleware from "../../middleware/auth.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import { wrapAsync } from "../../utils/response";

const commonAuthRouter = Router();

commonAuthRouter.post(
  "/register",
  authMiddleware.registerRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(authController.registerController)
);

commonAuthRouter.put(
  "/final-register/:register_token",
  wrapAsync(authController.finalRegisterController)
);

commonAuthRouter.post(
  "/login",
  authMiddleware.loginRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(authController.loginController)
);

commonAuthRouter.post(
  "/refresh-access-token",
  authMiddleware.verifyRefreshToken,
  wrapAsync(authController.refreshTokenController)
);

commonAuthRouter.post(
  "/logout",
  authMiddleware.verifyAccessToken,
  wrapAsync(authController.logoutController)
);

commonAuthRouter.post(
  "/forgot-password",
  authMiddleware.forgotPasswordRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(authController.forgotPasswordController)
);

commonAuthRouter.put(
  "/reset-password",
  authMiddleware.resetPasswordRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(authController.resetPasswordController)
);

export default commonAuthRouter;
