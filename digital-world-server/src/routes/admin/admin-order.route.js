import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import orderMiddleware from "../../middleware/order.middleware";
import orderController from "../../controllers/order.controller";
import { ROLE } from "../../constants/role.enum";

const adminOrderRouter = Router();

adminOrderRouter.get(
  "/get-orders",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyManagementAccess([ROLE.ADMIN, ROLE.STAFF]),
  orderMiddleware.getOrdersRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(orderController.getOrders)
);

adminOrderRouter.get(
  "/get-order/:order_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyManagementAccess([ROLE.ADMIN, ROLE.STAFF]),
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  wrapAsync(orderController.getOrder)
);

adminOrderRouter.get(
  "/get-user-orders/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyManagementAccess([ROLE.ADMIN, ROLE.STAFF]),
  helpersMiddleware.idRule("user_id"),
  helpersMiddleware.idValidator,
  wrapAsync(orderController.getUserOrders)
);

adminOrderRouter.get(
  "/get-all-orders",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyManagementAccess([ROLE.ADMIN, ROLE.STAFF]),
  wrapAsync(orderController.getAllOrders)
);

adminOrderRouter.put(
  "/update-user-order/:order_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyManagementAccess([ROLE.ADMIN, ROLE.STAFF]),
  helpersMiddleware.idRule("order_id"),
  helpersMiddleware.idValidator,
  wrapAsync(orderController.updateUserOrder)
);

export default adminOrderRouter;
