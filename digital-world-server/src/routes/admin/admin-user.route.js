import { Router } from "express";
import userController from "../../controllers/user.controller";
import authMiddleware from "../../middleware/auth.middleware";
import helpersMiddleware from "../../middleware/helpers.middleware";
import userMiddleware from "../../middleware/user.middleware";
import { wrapAsync } from "../../utils/response";

const adminUserRouter = Router();

adminUserRouter.get(
  "/get-users",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  userMiddleware.getUsersRules(),
  helpersMiddleware.entityValidator,
  userController.getUsers
);

adminUserRouter.get(
  "/get-all-users",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  userController.getAllUsers
);

adminUserRouter.post(
  "/add-user",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  userMiddleware.addUserRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(userController.addUser)
);

adminUserRouter.get(
  "/get-user/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("user_id"),
  helpersMiddleware.idValidator,
  wrapAsync(userController.getUser)
);

adminUserRouter.put(
  "/update-user/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("user_id"),
  helpersMiddleware.idValidator,
  userMiddleware.updateUserRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(userController.updateUser)
);

adminUserRouter.delete(
  "/delete-user/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idRule("user_id"),
  helpersMiddleware.idValidator,
  wrapAsync(userController.deleteUser)
);

export default adminUserRouter;
