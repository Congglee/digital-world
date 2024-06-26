import mongoose from "mongoose";
import { STATUS } from "../constants/status";
import { ProductModel } from "../database/models/product.model";
import { UserModel } from "../database/models/user.model";
import { ErrorHandler, responseSuccess } from "../utils/response";

const ratingProduct = async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.jwtDecoded.id;
  const form = req.body;
  const { star, comment } = form;
  const userInDB = await UserModel.findById(user_id).lean().exec();
  const productDB = await ProductModel.findOne({ _id: product_id });
  if (productDB) {
    const alreadyRatingProduct = productDB.ratings.find(
      (item) => item.posted_by.toString() === user_id
    );
    if (alreadyRatingProduct) {
      alreadyRatingProduct.star = star;
      alreadyRatingProduct.comment = comment;
      alreadyRatingProduct.date = new Date().toISOString();
    } else {
      productDB.ratings.push({
        star,
        comment,
        user_name: userInDB.name,
        user_avatar: userInDB.avatar,
        posted_by: user_id,
        publish: true,
        date: new Date().toISOString(),
      });
    }
    const ratingCount = productDB.ratings.length;
    if (ratingCount > 0) {
      const sumRatings = productDB.ratings.reduce(
        (sum, item) => sum + item.star,
        0
      );
      productDB.total_ratings =
        Math.round((sumRatings * 10) / ratingCount) / 10;
    } else {
      productDB.total_ratings = 0;
    }
    await productDB.save();
    return responseSuccess(res, { message: "Đánh giá sản phẩm thành công" });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const deleteUserRating = async (req, res) => {
  const { product_id, rating_id } = req.params;
  const productDB = await ProductModel.findOneAndUpdate(
    { _id: product_id },
    { $pull: { ratings: { _id: rating_id } } },
    { new: true }
  );
  if (productDB) {
    const ratingCount = productDB.ratings.length;
    if (ratingCount > 0) {
      const sumRatings = productDB.ratings.reduce(
        (sum, item) => sum + item.star,
        0
      );
      productDB.total_ratings =
        Math.round((sumRatings * 10) / ratingCount) / 10;
    } else {
      productDB.total_ratings = 0;
    }
    await productDB.save();
    return responseSuccess(res, {
      message: "Xóa đánh giá sản phẩm thành công",
    });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const deleteMyRating = async (req, res) => {
  const user_id = req.jwtDecoded.id;
  const { product_id, rating_id } = req.params;
  const productDB = await ProductModel.findOne({ _id: product_id });
  if (productDB) {
    const rating = productDB.ratings.find(
      (item) =>
        item._id.toString() === rating_id &&
        item.posted_by.toString() === user_id
    );
    if (rating) {
      productDB.ratings.pull({ _id: rating_id });
      const ratingCount = productDB.ratings.length;
      if (ratingCount > 0) {
        const sumRatings = productDB.ratings.reduce(
          (sum, item) => sum + item.star,
          0
        );
        productDB.total_ratings =
          Math.round((sumRatings * 10) / ratingCount) / 10;
      } else {
        productDB.total_ratings = 0;
      }
      await productDB.save();
      return responseSuccess(res, {
        message: "Xóa đánh giá sản phẩm thành công",
      });
    } else {
      throw new ErrorHandler(
        STATUS.NOT_FOUND,
        "Không tìm thấy đánh giá sản phẩm"
      );
    }
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const deleteManyRatings = async (req, res) => {
  const { product_id } = req.params;
  const list_id = req.body.list_id.map((id) => new mongoose.Types.ObjectId(id));
  const productDB = await ProductModel.findOneAndUpdate(
    { _id: product_id },
    { $pull: { ratings: { _id: { $in: list_id } } } },
    { new: true }
  );
  if (productDB) {
    const ratingCount = productDB.ratings.length;
    if (ratingCount > 0) {
      const sumRatings = productDB.ratings.reduce(
        (sum, item) => sum + item.star,
        0
      );
      productDB.total_ratings =
        Math.round((sumRatings * 10) / ratingCount) / 10;
    } else {
      productDB.total_ratings = 0;
    }
    await productDB.save();
    return responseSuccess(res, {
      message: `Xóa ${list_id.length} đánh giá sản phẩm thành công`,
      data: { deleted_count: list_id.length },
    });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const updateRatingStatus = async (req, res) => {
  const { product_id, rating_id } = req.params;
  const { publish } = req.body;
  const productDB = await ProductModel.findOneAndUpdate(
    { _id: product_id, "ratings._id": rating_id },
    { $set: { "ratings.$.publish": publish } },
    { new: true }
  ).lean();
  if (productDB) {
    return responseSuccess(res, {
      message: "Cập nhật trạng thái hiển thị của đánh giá thành công",
    });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const reviewController = {
  ratingProduct,
  deleteUserRating,
  deleteManyRatings,
  updateRatingStatus,
  deleteMyRating,
};

export default reviewController;
