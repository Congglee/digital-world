import { omitBy } from "lodash";
import { DELIVERY_STATUS } from "../constants/purchase";
import { ORDER, ORDER_SORT_BY } from "../constants/sort";
import { STATUS } from "../constants/status";
import { OrderModel } from "../database/models/order.model";
import { ProductModel } from "../database/models/product.model";
import { UserModel } from "../database/models/user.model";
import { ErrorHandler, responseSuccess } from "../utils/response";
import { generateOrderCode } from "../utils/utils";

const addOrder = async (req, res) => {
  const form = req.body;
  const user_id = req.jwtDecoded.id;
  const {
    order_fullname,
    order_phone,
    order_note,
    payment_method,
    delivery_at,
    products,
  } = form;
  const userInDB = await UserModel.findById(user_id).lean().exec();

  if (products.length > 0) {
    let totalAmount = 0;
    const productsData = products.map((product) => {
      totalAmount += product.price * product.buy_count;
      return {
        product_id: product._id,
        product_name: product.name,
        product_price: product.price,
        product_thumb: product.thumb,
        buy_count: product.buy_count,
      };
    });
    const orderCode = generateOrderCode();
    const order = {
      order_code: orderCode,
      order_by: {
        user_avatar: userInDB.avatar,
        user_email: userInDB.email,
        user_id,
      },
      products: productsData,
      total_amount: totalAmount,
      date_of_order: new Date().toISOString(),
      shipping_address: { order_fullname, order_phone, delivery_at },
      order_note,
      payment_method,
    };
    const orderAdd = await new OrderModel(order).save();
    for (const product of products) {
      await ProductModel.findByIdAndUpdate(product._id, {
        $inc: { sold: product.buy_count, quantity: -product.buy_count },
      });
    }
    const response = {
      message: "Tạo mới đơn hàng thành công",
      data: orderAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.__v;
          return ret;
        },
      }),
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(
      STATUS.BAD_REQUEST,
      "Giỏ hàng đang không có sản phẩm nào, không thể tạo đơn hàng"
    );
  }
};

const updateUserOrder = async (req, res) => {
  const form = req.body;
  const { order_status, delivery_status, payment_status } = form;
  const order = omitBy(
    { order_status, delivery_status, payment_status },
    (value) => value === undefined || value === ""
  );
  const orderDB = await OrderModel.findByIdAndUpdate(
    req.params.order_id,
    order,
    { new: true }
  )
    .select({ __v: 0 })
    .lean();
  if (orderDB) {
    const response = {
      message: "Cập nhật đơn hàng thành công",
      data: orderDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy đơn hàng");
  }
};

const updateMyOrder = async (req, res) => {
  const order_id = req.params.order_id;
  const form = req.body;
  const { order_status } = form;
  const order = omitBy(
    { order_status },
    (value) => value === undefined || value === ""
  );
  const orderDB = await OrderModel.findById({
    _id: order_id,
    "order_by.user_id": req.jwtDecoded.id,
  })
    .select({ __v: 0 })
    .lean();
  if (orderDB) {
    if (
      orderDB.delivery_status === DELIVERY_STATUS.WAIT_FOR_CONFIRMATION ||
      orderDB.delivery_status === DELIVERY_STATUS.CONFIRMED
    ) {
      const userOrderDB = await OrderModel.findByIdAndUpdate(order_id, order, {
        new: true,
      })
        .lean()
        .exec();
      const response = {
        message: "Cập nhật đơn hàng thành công",
        data: userOrderDB,
      };
      return responseSuccess(res, response);
    } else {
      throw new ErrorHandler(
        STATUS.BAD_REQUEST,
        "Đơn hàng đã được xác nhận hoặc đang chuyển hàng, không thể hủy đơn hàng"
      );
    }
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy đơn hàng");
  }
};

const getOrder = async (req, res) => {
  const orderDB = await OrderModel.findById(req.params.order_id)
    .populate({
      path: "products.product_id",
      select: "name price price_before_discount thumb quantity",
    })
    .populate({
      path: "order_by.user_id",
      select:
        "name email phone avatar address province district ward date_of_birth",
    })
    .select({ __v: 0 })
    .lean();
  if (orderDB) {
    const response = {
      message: "Lấy đơn hàng thành công",
      data: orderDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy đơn hàng");
  }
};

const getOrderByOrderCode = async (req, res) => {
  const user_id = req.jwtDecoded.id;
  const orderDB = await OrderModel.findOne({
    order_code: req.params.order_code,
  })
    .populate({
      path: "products.product_id",
      select: "name price price_before_discount thumb quantity",
    })
    .populate({
      path: "order_by.user_id",
      select:
        "name email phone avatar address province district ward date_of_birth",
    })
    .select({ __v: 0 })
    .lean();
  if (orderDB) {
    if (orderDB.order_by.user_id._id.toString() === user_id) {
      const response = {
        message: "Lấy đơn hàng thành công",
        data: orderDB,
      };
      return responseSuccess(res, response);
    } else {
      throw new ErrorHandler(
        STATUS.FORBIDDEN,
        "Bạn có không có quyền truy cập đơn hàng này"
      );
    }
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy đơn hàng");
  }
};

const getOrders = async (req, res) => {
  let { page = 1, limit = 30, exclude, sort_by, order, status } = req.query;

  page = Number(page);
  limit = Number(limit);
  let condition = {};
  if (status) {
    condition.$or = [{ order_status: status }, { delivery_status: status }];
  }
  if (exclude) {
    condition._id = { $ne: exclude };
  }
  if (!ORDER.includes(order)) {
    order = ORDER[0];
  }
  if (!ORDER_SORT_BY.includes(sort_by)) {
    sort_by = ORDER_SORT_BY[0];
  }
  let [orders, totalOrders] = await Promise.all([
    OrderModel.find(condition)
      .sort({ [sort_by]: order === "desc" ? -1 : 1 })
      .skip(page * limit - limit)
      .limit(limit)
      .select({ __v: 0 })
      .lean(),
    OrderModel.find(condition).countDocuments().lean(),
  ]);
  const page_size = Math.ceil(totalOrders / limit) || 1;
  const response = {
    message: "Lấy các đơn hàng thành công",
    data: {
      orders,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  };
  return responseSuccess(res, response);
};

const getUserOrders = async (req, res) => {
  const { user_id } = req.params;
  const userDB = await UserModel.findById(user_id);
  if (userDB) {
    let orders = await OrderModel.find({ "order_by.user_id": user_id })
      .sort({ createdAt: -1 })
      .select({ __v: 0 })
      .lean();
    const response = {
      message: "Lấy tất cả đơn hàng của người dùng thành công",
      data: { orders },
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy người dùng");
  }
};

const getMyOrders = async (req, res) => {
  let orders = await OrderModel.find({ "order_by.user_id": req.jwtDecoded.id })
    .sort({ createdAt: -1 })
    .select({ __v: 0 })
    .lean();
  const response = {
    message: "Lấy tất cả đơn hàng của tài khoản thành công",
    data: { orders },
  };
  return responseSuccess(res, response);
};

const getAllOrders = async (req, res) => {
  let orders = await OrderModel.find({})
    .sort({ createdAt: -1 })
    .select({ __v: 0 })
    .lean();
  const response = {
    message: "Lấy tất cả đơn hàng thành công",
    data: { orders },
  };
  return responseSuccess(res, response);
};

const orderController = {
  addOrder,
  updateUserOrder,
  updateMyOrder,
  getOrder,
  getOrders,
  getAllOrders,
  getUserOrders,
  getMyOrders,
  getOrderByOrderCode,
};

export default orderController;
