import { Router } from "express";
import helpersMiddleware from "../../middleware/helpers.middleware";
import { wrapAsync } from "../../utils/response";
import mailMiddleware from "../../middleware/mail.middleware";
import mailController from "../../controllers/mail.controller";

const commonMailRouter = Router();

commonMailRouter.post(
  "/send-mail",
  mailMiddleware.sendCommonMailRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(mailController.sendCommonMail)
);

export default commonMailRouter;
