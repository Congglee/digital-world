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

userUserRouter.post(
  "/add-to-cart",
  userMiddleware.addToCartRules(),
  helpersMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(userController.addToCart)
);

userUserRouter.put(
  "/update-cart",
  userMiddleware.updateCartRules(),
  helpersMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(userController.updateCart)
);

userUserRouter.delete(
  "/delete-products-cart",
  userMiddleware.deleteProductsCartRules(),
  helpersMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(userController.deleteProductsCart)
);

export default userUserRouter;
