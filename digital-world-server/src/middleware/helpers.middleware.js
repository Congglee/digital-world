import { validationResult, check, body } from "express-validator";
import { STATUS } from "../constants/status";
import { responseError, ErrorHandler } from "../utils/response";
import { isMongoId } from "../utils/validate";

const idRule = (...id) => {
  return id.map((item) => {
    return check(item).isMongoId().withMessage(`${item} không đúng định dạng`);
  });
};

const listIdRule = (list_id) => {
  return body(list_id)
    .custom((value) => {
      if (!Array.isArray(value)) {
        return false;
      }
      if (value.length === 0) {
        return false;
      }
      return value.findIndex((item) => !isMongoId(item));
    })
    .withMessage(`${list_id} không đúng định dạng`);
};

const idValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const error = errors.array().reduce((result, item, index) => {
    result[item.param] = item.msg;
    return result;
  }, {});
  return responseError(res, new ErrorHandler(STATUS.BAD_REQUEST, error));
};

const entityValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const error = errors
    .array({ onlyFirstError: true })
    .reduce((result, item, index) => {
      result[item.param] = item.msg;
      return result;
    }, {});

  return responseError(
    res,
    new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, error)
  );
};

const helpersMiddleware = {
  idRule,
  idValidator,
  entityValidator,
  listIdRule,
};

export default helpersMiddleware;
