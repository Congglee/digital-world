import { STATUS } from "../constants/status";
import { ProductModel } from "../database/models/product.model";
import { UserModel } from "../database/models/user.model";
import { ErrorHandler, responseSuccess } from "../utils/response";

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
          select: "name price price_before_discount thumb quantity",
          populate: { path: "category", select: "name" },
        })
        .select({ cart: 1 })
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
      )
        .populate({
          path: "cart.product",
          select: "name price price_before_discount thumb quantity",
          populate: { path: "category", select: "name" },
        })
        .select({ cart: 1 })
        .lean();
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
        select: "name price price_before_discount thumb quantity",
        populate: { path: "category", select: "name" },
      })
      .select({ cart: 1 })
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

const cartController = {
  addToCart,
  updateCart,
  deleteProductsCart,
};

export default cartController;
