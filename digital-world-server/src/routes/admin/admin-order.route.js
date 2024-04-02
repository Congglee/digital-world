import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import orderMiddleware from "../../middleware/order.middleware";
import OrderController from "../../controllers/order.controller";

const adminOrderRouter = Router();

adminOrderRouter.get(
  "/get-orders",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  orderMiddleware.getOrdersRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(OrderController.getOrders)
);

adminOrderRouter.get(
  "/get-order/:order_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  wrapAsync(OrderController.getOrder)
);

adminOrderRouter.get(
  "/get-all-orders",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(OrderController.getAllOrders)
);

adminOrderRouter.put(
  "/update-user-order/:order_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  orderMiddleware.updateUserOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(OrderController.updateUserOrder)
);

export default adminOrderRouter;
