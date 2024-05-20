import { omitBy } from "lodash";
import mongoose from "mongoose";
import { BRANDS_SORT_BY, ORDER } from "../constants/sort";
import { STATUS } from "../constants/status";
import { BrandModel } from "../database/models/brand.model";
import { CategoryModel } from "../database/models/category.model";
import { ProductModel } from "../database/models/product.model";
import { ErrorHandler, responseSuccess } from "../utils/response";

const addBrand = async (req, res) => {
  const form = req.body;
  const { name, image, is_actived } = form;
  const brand = { name, image, is_actived };
  const brandAdd = await new BrandModel(brand).save();
  const response = {
    message: "Tạo mới thương hiệu thành công",
    data: brandAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    }),
  };
  return responseSuccess(res, response);
};

const getBrands = async (req, res) => {
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
  if (!BRANDS_SORT_BY.includes(sort_by)) {
    sort_by = BRANDS_SORT_BY[0];
  }

  let [brands, totalBrands] = await Promise.all([
    BrandModel.find(condition)
      .sort({ [sort_by]: order === "desc" ? -1 : 1 })
      .skip(page * limit - limit)
      .limit(limit)
      .select({ __v: 0 })
      .lean(),
    BrandModel.find(condition).countDocuments().lean(),
  ]);
  const page_size = Math.ceil(totalBrands / limit) || 1;
  const response = {
    message: "Lấy danh sách thương hiệu thành công",
    data: {
      brands,
      pagination: {
        page,
        limit,
        page_size,
      },
    },
  };
  return responseSuccess(res, response);
};

const getAllBrands = async (req, res) => {
  const { exclude } = req.query;
  let condition = exclude ? { _id: { $ne: exclude } } : {};
  const brands = await BrandModel.find(condition)
    .sort({ createdAt: -1 })
    .select({ __v: 0 })
    .lean();
  const response = {
    message: "Lấy tât cả thương hiệu thành công",
    data: { brands },
  };
  return responseSuccess(res, response);
};

const getBrand = async (req, res) => {
  const brandDB = await BrandModel.findById(req.params.brand_id)
    .select({ __v: 0 })
    .lean();
  if (brandDB) {
    const response = {
      message: "Lấy thương hiệu thành công",
      data: brandDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy thương hiệu");
  }
};

const updateBrand = async (req, res) => {
  const form = req.body;
  const { name, image, is_actived } = form;
  const brand = omitBy(
    { name, image, is_actived },
    (value) => value === undefined || value === ""
  );
  const brandDB = await BrandModel.findByIdAndUpdate(
    req.params.brand_id,
    brand,
    { new: true }
  )
    .select({ __v: 0 })
    .lean();
  if (brandDB) {
    const response = {
      message: "Cập nhật thương hiệu thành công",
      data: brandDB,
    };
    return responseSuccess(res, response);
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy thương hiệu");
  }
};

const deleteBrand = async (req, res) => {
  const brand_id = req.params.brand_id;
  const brandDB = await BrandModel.findByIdAndDelete(brand_id).lean();
  if (brandDB) {
    const productsUpdated = await ProductModel.find({ brand: brandDB.name });
    if (productsUpdated.length > 0) {
      await ProductModel.updateMany(
        { brand: brandDB.name },
        {
          $set: { brand: "Unbranded" },
        }
      );
    }
    await CategoryModel.updateMany(
      { brands: brand_id },
      { $pull: { brands: brand_id } }
    );
    return responseSuccess(res, { message: "Xóa thương hiệu thành công" });
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, "Không tìm thấy thương hiệu");
  }
};

const deleteManyBrands = async (req, res) => {
  const list_id = req.body.list_id.map((id) => new mongoose.Types.ObjectId(id));
  const brandDB = await BrandModel.find({ _id: { $in: list_id } }).lean();
  const deletedData = await BrandModel.deleteMany({
    _id: { $in: list_id },
  }).lean();
  if (brandDB.length > 0) {
    const brandDBNames = brandDB.map((brand) => brand.name);
    await Promise.all([
      ProductModel.updateMany(
        { brand: { $in: brandDBNames } },
        { $set: { brand: "Unbranded" } }
      ),
      CategoryModel.updateMany(
        { brands: { $in: list_id } },
        { $pull: { brands: { $in: list_id } } }
      ),
    ]);

    return responseSuccess(res, {
      message: `Xóa ${deletedData.deletedCount} thương hiệu thành công`,
      data: { deleted_count: deletedData.deletedCount },
    });
  }
  throw new ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy thương hiệu");
};

const brandController = {
  addBrand,
  getBrand,
  getBrands,
  getAllBrands,
  updateBrand,
  deleteBrand,
  deleteManyBrands,
};

export default brandController;
