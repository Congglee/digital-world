import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import helpersMiddleware from "../../middleware/helpers.middleware";
import paymentMethodMiddleware from "../../middleware/payment-method.middleware";
import paymentMethodController from "../../controllers/payment-method.controller";

const userPaymentRouter = Router();

userPaymentRouter.get(
  "/get-all-payment-methods",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  paymentMethodMiddleware.getPaymentMethodsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentMethodController.getAllPaymentMethods)
);

export default userPaymentRouter;
