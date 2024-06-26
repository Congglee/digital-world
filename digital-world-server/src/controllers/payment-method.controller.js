import { omitBy } from "lodash";
import { ORDER, PAYMENT_METHODS_SORT_BY } from "../constants/sort";
import { STATUS } from "../constants/status";
import { PaymentMethodModel } from "../database/models/payment-method.model";
import { ErrorHandler, responseSuccess } from "../utils/response";

const addPaymentMethod = async (req, res) => {
  const form = req.body;
  const { name, image, is_actived, description } = form;
  const paymentMethod = { name, image, is_actived, description };
  const paymentMethodAdd = await new PaymentMethodModel(paymentMethod).save();
  const response = {
    message: "Tạo mới phương thức thanh toán thành công",
    data: paymentMethodAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    }),
  };
  return responseSuccess(res, response);
};

const getPaymentMethods = async (req, res) => {
  let { page = 1, limit = 30, name, exclude, sort_by, order } = req.query;

  page = Number(page);
  limit = Number(limit);
  let condition = {};
  if (exclude) {
    condition._id = { $ne: exclude };
  }
  if (name) {
    condition.name = { $regex: name, $options: "i" };
  }
  if (!ORDER.includes(order)) {
    order = ORDER[0];
  }
  if (!PAYMENT_METHODS_SORT_BY.includes(sort_by)) {
    sort_by = PAYMENT_METHODS_SORT_BY[0];
  }

  let [paymentMethods, totalPaymentMethods] = await Promise.all([
    PaymentMethodModel.find(condition)
      .sort({ [sort_by]: order === "desc" ? -1 : 1 })
      .skip(page * limit - limit)
      .limit(limit)
      .select({ __v: 0 })
      .lean(),
    PaymentMethodModel.find(condition).countDocuments().lean(),
  ]);
  const page_size = Math.ceil(totalPaymentMethods / limit) || 1;
  const response = {
    message: "Lấy danh sách phương thức thanh toán thành công",
    data: {
      payment_methods: paymentMethods,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  };
  return responseSuccess(res, response);
};

const getAllPaymentMethods = async (req, res) => {
  const { exclude } = req.query;
  let condition = exclude ? { _id: { $ne: exclude } } : {};
  const paymentMethods = await PaymentMethodModel.find(condition)
    .sort({ createdAt: -1 })
    .select({ __v: 0 })
    .lean();
  const response = {
    message: "Lấy tất cả phương thức thanh toán thành công",
    data: { payment_methods: paymentMethods },
  };
  return responseSuccess(res, response);
};

const getPaymentMethod = async (req, res) => {
  const paymentMethodDB = await PaymentMethodModel.findById(
    req.params.payment_method_id
  )
    .select({ __v: 0 })
    .lean();
  if (paymentMethodDB) {
    const response = {
      message: "Lấy phương thức thanh toán thành công",
      data: paymentMethodDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(
      STATUS.NOT_FOUND,
      "Không tìm thấy phương thức thanh toán"
    );
  }
};

const updatePaymentMethod = async (req, res) => {
  const form = req.body;
  const { name, image, is_actived, description } = form;
  const paymentMethod = omitBy(
    { name, image, is_actived, description },
    (value) => value === undefined
  );
  const paymentMethodDB = await PaymentMethodModel.findByIdAndUpdate(
    req.params.payment_method_id,
    paymentMethod,
    { new: true }
  )
    .select({ __v: 0 })
    .lean();
  if (paymentMethodDB) {
    const response = {
      message: "Cập nhật phương thức thanh toán thành công",
      data: paymentMethodDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(
      STATUS.BAD_REQUEST,
      "Không tìm thấy phương thức thanh toán"
    );
  }
};

const deletePaymentMethod = async (req, res) => {
  const paymentMethodId = req.params.payment_method_id;
  const paymentMethodDB = await PaymentMethodModel.findByIdAndDelete(
    paymentMethodId
  ).lean();
  if (paymentMethodDB) {
    return responseSuccess(res, {
      message: "Xóa phương thức thanh toán thành công",
    });
  } else {
    throw new ErrorHandler(
      STATUS.BAD_REQUEST,
      "Không tìm thấy phương thức thanh toán"
    );
  }
};

const paymentMethodController = {
  addPaymentMethod,
  getPaymentMethods,
  getAllPaymentMethods,
  getPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};

export default paymentMethodController;
