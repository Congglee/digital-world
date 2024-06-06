import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import paymentMethodMiddleware from "../../middleware/payment-method.middleware";
import paymentMethodController from "../../controllers/payment-method.controller";

const adminPaymentRouter = Router();

adminPaymentRouter.get(
  "/get-payment-methods",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  paymentMethodMiddleware.getPaymentMethodsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentMethodController.getPaymentMethods)
);

adminPaymentRouter.get(
  "/get-all-payment-methods",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  paymentMethodMiddleware.getPaymentMethodsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentMethodController.getAllPaymentMethods)
);

adminPaymentRouter.post(
  "/add-payment-method",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  paymentMethodMiddleware.addPaymentMethodRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentMethodController.addPaymentMethod)
);

adminPaymentRouter.get(
  "/get-payment-method/:payment_method_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("payment_method_id"),
  helpersMiddleware.idValidator,
  wrapAsync(paymentMethodController.getPaymentMethod)
);

adminPaymentRouter.put(
  "/update-payment-method/:payment_method_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("payment_method_id"),
  helpersMiddleware.idValidator,
  paymentMethodMiddleware.updatePaymentMethodRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentMethodController.updatePaymentMethod)
);

adminPaymentRouter.delete(
  "/delete-payment-method/:payment_method_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("payment_method_id"),
  helpersMiddleware.idValidator,
  wrapAsync(paymentMethodController.deletePaymentMethod)
);

export default adminPaymentRouter;
