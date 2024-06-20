const { RESPONSES, APIResponseManager } = require("../common/index.js");
const categoryModel = require("../models/category.model");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log("creating  category");
    if (!name) {
      return APIResponseManager.badRequest(res, "provide a category name");
    }

    const existingName = await categoryModel.findOne({ name });
    console.log("existingname", existingName);
    if (existingName) {
      console.log("existingName", existingName);
      return APIResponseManager.badRequest(res, "name is already taken");
    }
    let categoryCreated = await new categoryModel({ name });
    categoryCreated = await categoryCreated.save();
    if (categoryCreated) {
      return APIResponseManager.success(res, categoryCreated);
    }
    return APIResponseManager.badRequest(res, "unable to create category");
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log("deleting", id);
    if (!id) {
      return APIResponseManager.badRequest(res, "provide a category id");
    }
    await categoryModel.findByIdAndDelete(id);
    return APIResponseManager.success(res, "deleted  category with id " + id);
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await categoryModel.deleteMany({});
    return APIResponseManager.success(res, "deleted all categories");
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const response = await categoryModel.find({});
    return APIResponseManager.success(res, response);
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};
