const { RESPONSES, APIResponseManager } = require("../common/index.js");
const ArticleModel = require("../models/article.model.js");
const CategoryModel = require("../models/category.model.js");
// create a feed
exports.create = async (req, res, next) => {
  try {
    const {
      heading,
      readTime,
      description,
      categories,
      image,
      verified,
      newest,
      trending,
    } = req.body;
    // response if there is no valid data
    console.log(Object.values(req.body));
    Object.entries(req.body).map(([key, item]) => {
      if (key !== "image" && !item) {
        return APIResponseManager.badRequest(res, `please provide a ${key}`);
      }
    });

    if (categories && Array.isArray(categories)) {
      categories.forEach(async (category) => {
        const existingCategory = await CategoryModel.findById(category);
        if (!existingCategory) {
          return APIResponseManager.badRequest(res, "category not found");
        }
      });
    }
    const newData = new ArticleModel({
      heading,
      readTime,
      description,
      categories,
      image,
      verified,
      newest,
      trending,
    });

    newData
      .save()
      .then((data) => {
        if (data) {
          return APIResponseManager.success(res, data);
        }
      })
      .catch((err) => APIResponseManager.notSuccess(res, err));
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

// update a feed
exports.update = (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return APIResponseManager.badRequest(
        res,
        "please provide a id as parameter"
      );
    }

    ArticleModel.findByIdAndUpdate(id, req.body)
      .then((data) => {
        if (data) {
          return APIResponseManager.success(res, data);
        }
        return APIResponseManager.badRequest(
          res,
          "no such feed was found on the db"
        );
      })
      .catch((err) => {
        console.log(err);
        return APIResponseManager.notSuccess(res, err);
      });
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

// find one feed
exports.findOne = (req, res, next) => {
  try {
    console.log("finding one");
    const { id } = req.params;
    if (!id) {
      return APIResponseManager.badRequest(res, "please provide a id");
    }

    ArticleModel.findById(id)
      .then((data) => {
        if (data) {
          return APIResponseManager.success(res, data);
        }
        return APIResponseManager.badRequest(
          res,
          "no such feed was found on the db"
        );
      })
      .catch((err) => {
        return APIResponseManager.notSuccess(res, err);
      });
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

// find all feeds
exports.findAll = async (req, res, next) => {
  try {
    let { category, readTime } = req.query;
    const query = {};
    if (category && !Array.isArray(category)) {
      const existingCategory = await CategoryModel.findById(category);
      if (!existingCategory) {
        return APIResponseManager.badRequest(res, "category not found");
      }
      query.categories = { $in: [existingCategory.id] };
    } else if (Array.isArray(category) && category.length > 0) {
      const existingCategories = await Promise.all(
        category.map(async (item) => await CategoryModel.findById(item.id))
      );
      console.log(existingCategories);
      if (existingCategories) {
        query.categories = { $in: [category] };
      }
    }
    if (readTime) {
      query.readTime = { $gt: parseInt(readTime) };
    }
    console.log(query);
    const matchedArticles = await ArticleModel.find(query);
    if (matchedArticles) {
      return APIResponseManager.success(res, matchedArticles);
    }

    return APIResponseManager.badRequest(res, "no articles found");
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await ArticleModel.deleteMany({});
    return APIResponseManager.success(res, "deleted all articles");
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};

// delete one feed
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("deleting", req.params);
    if (!id) {
      return APIResponseManager.badRequest(
        res,
        "please provide a id as parameter"
      );
    }

    ArticleModel.findByIdAndDelete(id, req.body)
      .then((data) => {
        if (data) {
          return APIResponseManager.success(
            res,
            `deleted article with id ${id}`
          );
        }

        return APIResponseManager.badRequest(res, `no article with id ${id}`);
      })
      .catch((err) => {
        return APIResponseManager.notSuccess(res, err.message);
      });
  } catch (error) {
    console.log(error);
    return APIResponseManager.notSuccess(res, error);
  }
};
