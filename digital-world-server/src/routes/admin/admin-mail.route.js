import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import { wrapAsync } from "../../utils/response";
import mailMiddleware from "../../middleware/mail.middleware";
import mailController from "../../controllers/mail.controller";
import { ROLE } from "../../constants/role.enum";

const adminMailRouter = Router();

adminMailRouter.post(
  "/send-notify-mail",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyManagementAccess([ROLE.ADMIN, ROLE.STAFF]),
  mailMiddleware.sendNotifyMailRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(mailController.sendNotifyMail)
);

export default adminMailRouter;
