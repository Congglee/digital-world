import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import orderMiddleware from "../../middleware/order.middleware";
import orderController from "../../controllers/order.controller";

const adminOrderRouter = Router();

adminOrderRouter.get(
  "/get-orders",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  orderMiddleware.getOrdersRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(orderController.getOrders)
);

adminOrderRouter.get(
  "/get-order/:order_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  wrapAsync(orderController.getOrder)
);

adminOrderRouter.get(
  "/get-user-orders/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("user_id"),
  helpersMiddleware.idValidator,
  wrapAsync(orderController.getUserOrders)
);

adminOrderRouter.get(
  "/get-all-orders",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  wrapAsync(orderController.getAllOrders)
);

adminOrderRouter.put(
  "/update-user-order/:order_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  orderMiddleware.updateUserOrderRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(orderController.updateUserOrder)
);

export default adminOrderRouter;
