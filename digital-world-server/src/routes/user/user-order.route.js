import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import helpersMiddleware from "../../middleware/helpers.middleware";
import orderMiddleware from "../../middleware/order.middleware";
import OrderController from "../../controllers/order.controller";

const userOrderRouter = Router();

userOrderRouter.post(
  "/add-order",
  authMiddleware.verifyAccessToken,
  orderMiddleware.addOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(OrderController.addOrder)
);

userOrderRouter.get(
  "/get-order/:order_id",
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  wrapAsync(OrderController.getOrder)
);

userOrderRouter.put(
  "/update-my-order/:order_id",
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  orderMiddleware.updateMyOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(OrderController.updateMyOrder)
);

export default userOrderRouter;
