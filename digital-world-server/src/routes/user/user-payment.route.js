import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import helpersMiddleware from "../../middleware/helpers.middleware";
import paymentMethodMiddleware from "../../middleware/payment-method.middleware";
import paymentMethodController from "../../controllers/payment-method.controller";
import paymentController from "../../controllers/payment.controller";
import orderMiddleware from "../../middleware/order.middleware";
import paymentMiddleware from "../../middleware/payment.middleware";

const userPaymentRouter = Router();

userPaymentRouter.get(
  "/get-all-payment-methods",
  authMiddleware.verifyAccessToken,
  paymentMethodMiddleware.getPaymentMethodsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentMethodController.getAllPaymentMethods)
);

userPaymentRouter.post(
  "/create-stripe-checkout-session",
  authMiddleware.verifyAccessToken,
  orderMiddleware.addOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentController.createStripeCheckoutSession)
);

userPaymentRouter.post(
  "/create-paypal-payment",
  authMiddleware.verifyAccessToken,
  paymentMiddleware.createPayPalOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(paymentController.createPayPalOrder)
);

userPaymentRouter.get(
  "/delete-paypal-order-cancel/:order_id",
  wrapAsync(paymentController.deletePayPalOrderCancel)
);

export default userPaymentRouter;
