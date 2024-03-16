import { Router } from "express";
import userMiddleware from "../../middleware/user.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import cartController from "../../controllers/cart.controller";

const userCartRouter = Router();

userCartRouter.post(
  "/add-to-cart",
  userMiddleware.addToCartRules(),
  helpersMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(cartController.addToCart)
);

userCartRouter.put(
  "/update-cart",
  userMiddleware.updateCartRules(),
  helpersMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(cartController.updateCart)
);

userCartRouter.delete(
  "/delete-products-cart",
  userMiddleware.deleteProductsCartRules(),
  helpersMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(cartController.deleteProductsCart)
);

export default userCartRouter;
