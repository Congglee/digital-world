import { omitBy } from "lodash";
import mongoose from "mongoose";
import { ORDER, USERS_SORT_BY } from "../constants/sort";
import { STATUS } from "../constants/status";
import { UserModel } from "../database/models/user.model";
import { hashValue } from "../utils/crypto";
import { ErrorHandler, responseSuccess } from "../utils/response";

const addUser = async (req, res) => {
  const form = req.body;
  const {
    name,
    email,
    password,
    date_of_birth,
    address,
    province,
    district,
    ward,
    phone,
    roles,
    avatar,
    verify,
  } = form;
  const userInDB = await UserModel.findOne({ email: email }).exec();
  if (!userInDB) {
    const hashedPassword = hashValue(password);
    const user = {
      email,
      password: hashedPassword,
      roles,
      address,
      province,
      district,
      ward,
      date_of_birth,
      name,
      phone,
      avatar,
      verify,
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
    .select({ __v: 0, password: 0 })
    .lean();
  const response = {
    message: "Lấy danh sách tất cả người dùng thành công",
    data: { users },
  };
  return responseSuccess(res, response);
};

const getDetailMySelf = async (req, res) => {
  const userDB = await UserModel.findById(req.jwtDecoded.id)
    .populate({
      path: "cart.product",
      select: "name price price_before_discount thumb quantity",
      populate: { path: "category", select: "name" },
    })
    .populate({
      path: "wishlist",
      select: "name price price_before_discount thumb quantity",
      populate: { path: "category", select: "name" },
    })
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
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy người dùng");
  }
};

const updateUser = async (req, res) => {
  const form = req.body;
  const {
    password,
    address,
    province,
    district,
    ward,
    date_of_birth,
    name,
    phone,
    roles,
    avatar,
    verify,
  } = form;
  const user = omitBy(
    {
      password,
      address,
      province,
      district,
      ward,
      date_of_birth,
      name,
      phone,
      roles,
      avatar,
      verify,
    },
    (value) => value === undefined
  );
  const userDB = await UserModel.findById(req.params.user_id).lean();
  if (userDB) {
    let updatedUserDB;
    if (user.password) {
      const hashedPassword = hashValue(password);
      updatedUserDB = await UserModel.findByIdAndUpdate(
        req.params.user_id,
        { ...user, password: hashedPassword },
        { new: true }
      )
        .select({ password: 0, __v: 0 })
        .lean();
    } else {
      updatedUserDB = await UserModel.findByIdAndUpdate(
        req.params.user_id,
        user,
        { new: true }
      )
        .select({ password: 0, __v: 0 })
        .lean();
    }
    const response = {
      message: "Cập nhật người dùng thành công",
      data: updatedUserDB,
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
    province,
    district,
    ward,
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
      province,
      district,
      ward,
      date_of_birth,
      name,
      phone,
      avatar,
    },
    (value) => value === undefined
  );
  const userDB = await UserModel.findById(req.jwtDecoded.id).lean();
  if (user.password) {
    const hashedPassword = hashValue(password);
    if (hashedPassword === userDB.password) {
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

const deleteManyUsers = async (req, res) => {
  const list_id = req.body.list_id.map((id) => new mongoose.Types.ObjectId(id));
  const userDB = await UserModel.find({ _id: { $in: list_id } }).lean();
  const deletedData = await UserModel.deleteMany({
    _id: { $in: list_id },
  }).lean();
  if (userDB.length > 0) {
    return responseSuccess(res, {
      message: `Xóa ${deletedData.deletedCount} người dùng thành công`,
      data: { deleted_count: deletedData.deletedCount },
    });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy người dùng");
  }
};

const addToWishlist = async (req, res) => {
  const { product_id } = req.params;
  const user_id = req.jwtDecoded.id;
  const userDB = await UserModel.findByIdAndUpdate(
    user_id,
    { $addToSet: { wishlist: product_id } },
    { new: true }
  )
    .select({ wishlist: 1 })
    .lean();
  if (userDB) {
    return responseSuccess(res, {
      message: "Thêm sản phẩm vào danh sách yêu thích thành công",
      data: userDB,
    });
  } else {
    throw new ErrorHandler(
      STATUS.UNAUTHORIZED,
      "Thêm sản phẩm vào danh sách yêu thích thất bại"
    );
  }
};

const removeFromWishlist = async (req, res) => {
  const { product_id } = req.params;
  const user_id = req.jwtDecoded.id;
  const userDB = await UserModel.findById(user_id).lean();
  if (userDB) {
    const productIndex = userDB.wishlist.findIndex(
      (product) => product.toString() === product_id
    );
    if (productIndex !== -1) {
      const updatedUserDB = await UserModel.findByIdAndUpdate(
        user_id,
        { $pull: { wishlist: product_id } },
        { new: true }
      )
        .select({ wishlist: 1 })
        .lean();
      return responseSuccess(res, {
        message: "Xóa sản phẩm khỏi danh sách yêu thích thành công",
        data: updatedUserDB,
      });
    } else {
      throw new ErrorHandler(
        STATUS.BAD_REQUEST,
        "Sản phẩm không tồn tại trong danh sách yêu thích"
      );
    }
  } else {
    throw new ErrorHandler(STATUS.UNAUTHORIZED, "Không tìm thấy người dùng");
  }
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
  deleteManyUsers,
  addToWishlist,
  removeFromWishlist,
};

export default userController;
