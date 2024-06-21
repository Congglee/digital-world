import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import helpersMiddleware from "../../middleware/helpers.middleware";
import orderMiddleware from "../../middleware/order.middleware";
import orderController from "../../controllers/order.controller";

const userOrderRouter = Router();

userOrderRouter.post(
  "/add-order",
  authMiddleware.verifyAccessToken,
  orderMiddleware.addOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(orderController.addOrder)
);

userOrderRouter.get(
  "/get-order-by-order-code/:order_code",
  authMiddleware.verifyAccessToken,
  wrapAsync(orderController.getOrderByOrderCode)
);

userOrderRouter.get(
  "/get-my-orders",
  authMiddleware.verifyAccessToken,
  wrapAsync(orderController.getMyOrders)
);

userOrderRouter.put(
  "/update-my-order/:order_id",
  authMiddleware.verifyAccessToken,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  orderMiddleware.updateMyOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(orderController.updateMyOrder)
);

export default userOrderRouter;
