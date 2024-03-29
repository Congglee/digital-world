import { CATEGORY_SORT_BY, ORDER } from "../constants/sort";
import { STATUS } from "../constants/status";
import { CategoryModel } from "../database/models/category.model";
import { ProductModel } from "../database/models/product.model";
import { ErrorHandler, responseSuccess } from "../utils/response";

const addCategory = async (req, res) => {
  const { name, brands } = req.body;
  const categoryAdd = await new CategoryModel({ name, brands }).save();
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
  const { name, brands } = req.body;
  const categoryDB = await CategoryModel.findByIdAndUpdate(
    req.params.category_id,
    { name, brands },
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

const categoryController = {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

export default categoryController;
