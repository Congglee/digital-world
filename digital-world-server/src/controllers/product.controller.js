import { omitBy } from "lodash";
import { ORDER, PRODUCTS_SORT_BY } from "../constants/sort";
import { STATUS } from "../constants/status";
import { ProductModel } from "../database/models/product.model";
import { ErrorHandler, responseSuccess } from "../utils/response";
import mongoose from "mongoose";
import { isAdmin } from "../utils/validate";
import { UserModel } from "../database/models/user.model";

const addProduct = async (req, res) => {
  const form = req.body;
  const {
    name,
    thumb,
    images,
    overview,
    description,
    category,
    price,
    price_before_discount,
    quantity,
    brand,
    is_featured,
    is_published,
  } = form;
  const product = {
    name,
    thumb,
    images,
    overview,
    description,
    category,
    price,
    price_before_discount,
    quantity,
    brand,
    is_featured,
    is_published,
  };
  const productAdd = await new ProductModel(product).save();
  const response = {
    message: "Tạo mới sản phẩm thành công",
    data: productAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    }),
  };
  return responseSuccess(res, response);
};

const getProducts = async (req, res) => {
  let {
    page = 1,
    limit = 30,
    category,
    exclude,
    sort_by,
    order,
    price_max,
    price_min,
    name,
    brand,
  } = req.query;

  page = Number(page);
  limit = Number(limit);
  let condition = {};
  if (category) {
    condition.category = category;
  }
  if (exclude) {
    condition._id = { $ne: exclude };
  }
  if (price_max) {
    condition.price = {
      $lte: price_max,
    };
  }
  if (price_min) {
    condition.price = condition.price
      ? { ...condition.price, $gte: price_min }
      : { $gte: price_min };
  }
  if (!ORDER.includes(order)) {
    order = ORDER[0];
  }
  if (!PRODUCTS_SORT_BY.includes(sort_by)) {
    sort_by = PRODUCTS_SORT_BY[0];
  }
  if (name) {
    condition.name = {
      $regex: name,
      $options: "i",
    };
  }
  if (brand) {
    const brandQuery = brand.split(",").map((item) => ({
      brand: { $regex: item.trim(), $options: "i" },
    }));
    condition.$or = brandQuery;
  }
  let [products, totalProducts] = await Promise.all([
    ProductModel.find(condition)
      .populate({ path: "category" })
      .sort({ [sort_by]: order === "desc" ? -1 : 1 })
      .skip(page * limit - limit)
      .limit(limit)
      .select({ __v: 0, description: 0 })
      .lean(),
    ProductModel.find(condition).countDocuments().lean(),
  ]);
  const page_size = Math.ceil(totalProducts / limit) || 1;
  const response = {
    message: "Lấy các sản phẩm thành công",
    data: {
      products,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  };
  return responseSuccess(res, response);
};

const getAllProducts = async (req, res) => {
  let { category } = req.query;
  let condition = {};
  if (category) {
    condition = { category: category };
  }
  const products = await ProductModel.find(condition)
    .populate({ path: "category" })
    .sort({ createdAt: -1 })
    .select({ __v: 0, description: 0 })
    .lean();
  const response = {
    message: "Lấy tất cả sản phẩm thành công",
    data: products,
  };
  return responseSuccess(res, response);
};

const getProduct = async (req, res) => {
  let condition = { _id: req.params.product_id };
  const productDB = await ProductModel.findOneAndUpdate(
    condition,
    { $inc: { view: 1 } },
    { new: true }
  )
    .populate("category")
    .select({ __v: 0 })
    .lean();
  if (productDB) {
    const response = { message: "Lấy sản phẩm thành công", data: productDB };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const updateProduct = async (req, res) => {
  const form = req.body;
  const {
    name,
    thumb,
    images,
    overview,
    description,
    category,
    price,
    price_before_discount,
    quantity,
    brand,
    is_featured,
    is_published,
  } = form;
  const product = omitBy(
    {
      name,
      thumb,
      images,
      overview,
      description,
      category,
      price,
      price_before_discount,
      quantity,
      brand,
      is_featured,
      is_published,
    },
    (value) => value === undefined || value === ""
  );
  const productDB = await ProductModel.findByIdAndUpdate(
    req.params.product_id,
    product,
    { new: true }
  )
    .select({ __v: 0 })
    .lean();
  if (productDB) {
    const response = {
      message: "Cập nhật sản phẩm thành công",
      data: productDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const deleteProduct = async (req, res) => {
  const product_id = req.params.product_id;
  const productDB = await ProductModel.findByIdAndDelete(product_id).lean();
  if (productDB) {
    await UserModel.updateMany(
      { "cart.product": product_id },
      { $pull: { cart: { product: product_id } } }
    );
    return responseSuccess(res, { message: "Xóa sản phẩm thành công" });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const deleteManyProducts = async (req, res) => {
  const list_id = req.body.list_id.map((id) => new mongoose.Types.ObjectId(id));
  const productDB = await ProductModel.find({ _id: { $in: list_id } }).lean();
  const deletedData = await ProductModel.deleteMany({
    _id: { $in: list_id },
  }).lean();
  if (productDB.length > 0) {
    await UserModel.updateMany(
      { "cart.product": { $in: list_id } },
      { $pull: { cart: { product: { $in: list_id } } } }
    );
    return responseSuccess(res, {
      message: `Xóa ${deletedData.deletedCount} sản phẩm thành công`,
      data: { deleted_cound: deletedData.deletedCount },
    });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy sản phẩm");
  }
};

const searchProduct = async (req, res) => {
  let { searchText } = req.query;
  searchText = decodeURI(searchText);
  let condition = { $text: { $search: `\"${searchText}\"` } };
  if (!isAdmin(req)) {
    condition = Object.assign(condition, { visible: true });
  }
  let products = await ProductModel.find(condition)
    .populate("category")
    .sort({ createdAt: -1 })
    .select({ __v: 0, description: 0 })
    .lean();
  const response = {
    message: "Tìm các sản phẩm thành công",
    data: products,
  };
  return responseSuccess(res, response);
};

const ratingProduct = async (req, res) => {
  const form = req.body;
  const { star, comment, product_id } = form;
  const productDB = await ProductModel.findById(product_id);
  if (productDB) {
    const alreadyRatingProduct = productDB.ratings.find(
      (item) => item.posted_by.toString() === req.jwtDecoded.id
    );
    if (alreadyRatingProduct) {
      await ProductModel.updateOne(
        {
          ratings: { $elemMatch: alreadyRatingProduct },
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
            "ratings.$.date": new Date().toISOString(),
          },
        },
        { new: true }
      );
    } else {
      await productDB.updateOne(
        {
          $push: {
            ratings: {
              star,
              comment,
              posted_by: req.jwtDecoded.id,
              date: new Date().toISOString(),
            },
          },
        },
        { new: true }
      );
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

const ProductController = {
  addProduct,
  getProducts,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  searchProduct,
  ratingProduct,
};

export default ProductController;
