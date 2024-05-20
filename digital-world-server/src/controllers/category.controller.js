import { omitBy } from "lodash";
import { CATEGORY_SORT_BY, ORDER } from "../constants/sort";
import { STATUS } from "../constants/status";
import { CategoryModel } from "../database/models/category.model";
import { ProductModel } from "../database/models/product.model";
import { ErrorHandler, responseSuccess } from "../utils/response";
import mongoose from "mongoose";

const addCategory = async (req, res) => {
  const form = req.body;
  const { name, brands, is_actived } = form;
  const category = { name, brands, is_actived };
  const categoryAdd = await new CategoryModel(category).save();
  const response = {
    message: "Tạo mới danh mục thành công",
    data: categoryAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    }),
  };
  return responseSuccess(res, response);
};

const getCategories = async (req, res) => {
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
  if (!CATEGORY_SORT_BY.includes(sort_by)) {
    sort_by = CATEGORY_SORT_BY[0];
  }

  let [categories, totalCategories] = await Promise.all([
    CategoryModel.find(condition)
      .populate({ path: "brands", select: "name" })
      .sort({ [sort_by]: order === "desc" ? -1 : 1 })
      .skip(page * limit - limit)
      .limit(limit)
      .select({ __v: 0 })
      .lean(),
    CategoryModel.find(condition).countDocuments().lean(),
  ]);
  const page_size = Math.ceil(totalCategories / limit) || 1;
  const response = {
    message: "Lấy danh sách danh mục thành công",
    data: {
      categories,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  };
  return responseSuccess(res, response);
};

const getAllCategories = async (req, res) => {
  const { exclude } = req.query;
  let condition = exclude ? { _id: { $ne: exclude } } : {};
  const categories = await CategoryModel.find(condition)
    .populate({ path: "brands", select: "name" })
    .sort({ createdAt: -1 })
    .select({ __v: 0 })
    .lean();
  const response = {
    message: "Lấy tất cả danh mục thành công",
    data: { categories },
  };
  return responseSuccess(res, response);
};

const getCategory = async (req, res) => {
  const categoryDB = await CategoryModel.findById(req.params.category_id)
    .populate({ path: "brands", select: "name" })
    .select({ __v: 0 })
    .lean();
  if (categoryDB) {
    const response = {
      message: "Lấy danh mục thành công",
      data: categoryDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy danh mục");
  }
};

const updateCategory = async (req, res) => {
  const form = req.body;
  const { name, brands, is_actived } = form;
  const category = omitBy(
    { name, brands, is_actived },
    (value) => value === undefined || value === ""
  );
  const categoryDB = await CategoryModel.findByIdAndUpdate(
    req.params.category_id,
    category,
    { new: true }
  )
    .select({ __v: 0 })
    .lean();
  if (categoryDB) {
    const response = {
      message: "Cập nhật danh mục thành công",
      data: categoryDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy danh mục");
  }
};

const deleteCategory = async (req, res) => {
  const category_id = req.params.category_id;
  const categoryDB = await CategoryModel.findByIdAndDelete(category_id).lean();
  if (categoryDB) {
    const products = await ProductModel.find({ category: categoryDB });
    if (products.length > 0) {
      const uncategorized = await CategoryModel.findOne({
        name: "Uncategorized",
      });
      await ProductModel.updateMany(
        { category: categoryDB._id },
        {
          $set: { category: uncategorized._id, brand: "Unbranded" },
        }
      );
    }
    return responseSuccess(res, { message: "Xóa danh mục thành công" });
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy danh mục");
  }
};

const deleteManyCategories = async (req, res) => {
  const list_id = req.body.list_id.map((id) => new mongoose.Types.ObjectId(id));
  const categoryDB = await CategoryModel.find({ _id: { $in: list_id } }).lean();
  const deletedData = await CategoryModel.deleteMany({
    _id: { $in: list_id },
  }).lean();
  if (categoryDB.length > 0) {
    const uncategorized = await CategoryModel.findOne({
      name: "Uncategorized",
    });
    const categoryIds = categoryDB.map((category) => category._id);
    const products = await ProductModel.find({
      category: { $in: categoryIds },
    });
    if (products.length > 0) {
      await ProductModel.updateMany(
        { category: { $in: categoryIds } },
        {
          $set: { category: uncategorized._id, brand: "Unbranded" },
        }
      );
    }
    return responseSuccess(res, {
      message: `Xóa ${deletedData.deletedCount} danh mục thành công`,
      data: { deleted_count: deletedData.deletedCount },
    });
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy danh mục");
  }
};

const categoryController = {
  addCategory,
  getCategories,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  deleteManyCategories,
};

export default categoryController;
