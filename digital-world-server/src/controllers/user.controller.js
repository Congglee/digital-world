import { hashValue } from "../utils/crypt";
import { responseSuccess, ErrorHandler } from "../utils/response";
import { UserModel } from "../database/models/user.model";
import { ProductModel } from "../database/models/product.model";
import { STATUS } from "../constants/status";
import { omitBy } from "lodash";
import { ORDER, USERS_SORT_BY } from "../constants/sort";

const addUser = async (req, res) => {
  const form = req.body;
  const {
    name,
    email,
    password,
    date_of_birth,
    address,
    phone,
    roles,
    avatar,
    is_blocked,
  } = form;
  const userInDB = await UserModel.findOne({ email: email }).exec();
  if (!userInDB) {
    const hashedPassword = hashValue(password);
    const user = {
      email,
      password: hashedPassword,
      roles,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
      is_blocked,
    };
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    const userAdd = await new UserModel(user).save();
    const response = {
      message: "Tạo mới người dùng thành công",
      data: userAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.password;
          delete ret.__v;
          return ret;
        },
      }),
    };
    return responseSuccess(res, response);
  }
  throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
    email: "Email đã tồn tại",
  });
};

const getUsers = async (req, res) => {
  let { page = 1, limit = 30, name, sort_by, order_by, exclude } = req.query;

  page = Number(page);
  limit = Number(limit);
  let condition = {};
  if (exclude) {
    condition._id = { $ne: exclude };
  }
  if (!ORDER.includes(order_by)) {
    order_by = ORDER[0];
  }
  if (!USERS_SORT_BY.includes(sort_by)) {
    sort_by = USERS_SORT_BY[0];
  }
  if (name) {
    condition.name = { $regex: name, $options: "i" };
  }

  let [users, totalUsers] = await Promise.all([
    UserModel.find(condition)
      .sort({ [sort_by]: order_by === "desc" ? -1 : 1 })
      .skip(page * limit - limit)
      .limit(limit)
      .select({ __v: 0, password: 0 })
      .lean(),
    UserModel.find(condition).countDocuments().lean(),
  ]);
  const page_size = Math.ceil(totalUsers / limit) || 1;
  const response = {
    message: "Lấy danh sách người dùng thành công",
    data: {
      users,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  };
  return responseSuccess(res, response);
};

const getAllUsers = async (req, res) => {
  let users = await UserModel.find({})
    .sort({ createdAt: -1 })
    .select({ __v: 0, description: 0 })
    .lean();
  const response = { message: "Lấy tất cả người dùng thành công", data: users };
  return responseSuccess(res, response);
};

const getDetailMySelf = async (req, res) => {
  const userDB = await UserModel.findById(req.jwtDecoded.id)
    .select({ password: 0, __v: 0 })
    .lean();
  if (userDB) {
    const response = { message: "Lấy người dùng thành công", data: userDB };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.UNAUTHORIZED, "Không tìm thấy người dùng");
  }
};

const getUser = async (req, res) => {
  const userDB = await UserModel.findById(req.params.user_id)
    .select({ password: 0, __v: 0 })
    .lean();
  if (userDB) {
    const response = { message: "Lấy người dùng thành công", data: userDB };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy người dùng");
  }
};

const updateUser = async (req, res) => {
  const form = req.body;
  const {
    password,
    address,
    date_of_birth,
    name,
    phone,
    roles,
    is_blocked,
    avatar,
  } = form;
  const user = omitBy(
    {
      password,
      address,
      date_of_birth,
      name,
      phone,
      roles,
      is_blocked,
      avatar,
    },
    (value) => value === undefined || value === ""
  );
  const userDB = await UserModel.findByIdAndUpdate(req.params.user_id, user, {
    new: true,
  })
    .select({ password: 0, __v: 0 })
    .lean();
  if (userDB) {
    const response = {
      message: "Cập nhật người dùng thành công",
      data: userDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy người dùng");
  }
};

const updateMe = async (req, res) => {
  const form = req.body;
  const {
    email,
    password,
    new_password,
    address,
    date_of_birth,
    name,
    phone,
    avatar,
  } = form;
  const user = omitBy(
    {
      email,
      password,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
    },
    (value) => value === undefined || value === ""
  );
  const userDB = await UserModel.findById(req.jwtDecoded.id).lean();
  if (user.password) {
    const hash_password = hashValue(password);
    if (hash_password === userDB.password) {
      Object.assign(user, { password: hashValue(new_password) });
    } else {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: "Mật khẩu không đúng",
      });
    }
  }
  const updatedUserDB = await UserModel.findByIdAndUpdate(
    req.jwtDecoded.id,
    user,
    { new: true }
  )
    .select({ password: 0, __v: 0 })
    .lean();
  const response = {
    message: "Cập nhật thông tin tài khoản thành công",
    data: updatedUserDB,
  };
  return responseSuccess(res, response);
};

const deleteUser = async (req, res) => {
  const user_id = req.params.user_id;
  const userDB = await UserModel.findByIdAndDelete(user_id).lean();
  if (userDB) {
    return responseSuccess(res, { message: "Xóa người dùng thành công" });
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy người dùng");
  }
};

const addToCart = async (req, res) => {
  const { product_id, buy_count } = req.body;
  const productDB = await ProductModel.findById(product_id).lean();
  if (productDB) {
    if (buy_count > productDB.quantity) {
      throw new ErrorHandler(
        STATUS.NOT_ACCEPTABLE,
        "Số lượng vượt quá số lượng sản phẩm"
      );
    }
    const user = await UserModel.findById(req.jwtDecoded.id);
    const alreadyInCart = user.cart.find(
      (item) => item.product.toString() === product_id
    );

    let data;
    if (alreadyInCart) {
      data = await UserModel.findOneAndUpdate(
        { _id: req.jwtDecoded.id, "cart.product": product_id },
        { $inc: { "cart.$.buy_count": buy_count } },
        { new: true }
      )
        .populate({
          path: "cart.product",
          populate: {
            path: "category",
          },
        })
        .lean();
    } else {
      data = await UserModel.findByIdAndUpdate(
        req.jwtDecoded.id,
        {
          $push: {
            cart: {
              product: productDB._id,
              buy_count: buy_count,
              price: productDB.price,
              price_before_discount: productDB.price_before_discount,
            },
          },
        },
        { new: true }
      ).populate({
        path: "cart.product",
        populate: {
          path: "category",
        },
      });
    }
    const response = { message: "Thêm sản phẩm vào giỏ hàng thành công", data };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const updateCart = async (req, res) => {
  const { product_id, buy_count } = req.body;
  const productDB = await ProductModel.findById(product_id).lean();
  if (productDB) {
    if (buy_count > productDB.quantity) {
      throw new ErrorHandler(
        STATUS.NOT_ACCEPTABLE,
        "Số lượng vượt quá số lượng sản phẩm"
      );
    }
    const data = await UserModel.findOneAndUpdate(
      { _id: req.jwtDecoded.id, "cart.product": product_id },
      { $set: { "cart.$.buy_count": buy_count } },
      { new: true }
    )
      .populate({
        path: "cart.product",
        populate: {
          path: "category",
        },
      })
      .lean();
    const response = { message: "Cập nhập giỏ hàng thành công", data };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const deleteProductsCart = async (req, res) => {
  const product_ids = req.body;
  const user_id = req.jwtDecoded.id;
  await UserModel.findByIdAndUpdate(
    user_id,
    { $pull: { cart: { product: { $in: product_ids } } } },
    { new: true }
  );
  return responseSuccess(res, {
    message: `Xóa ${product_ids.length} sản phẩm trong giỏ hàng thành công`,
    data: { deleted_products_cart: product_ids.length },
  });
};

const userController = {
  addUser,
  getUsers,
  getAllUsers,
  getDetailMySelf,
  getUser,
  updateUser,
  updateMe,
  deleteUser,
  addToCart,
  updateCart,
  deleteProductsCart,
};

export default userController;
