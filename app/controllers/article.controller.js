const { RESPONSES } = require("../common/index.js");
const ArticleModel = require("../models/article.model.js");
const CategoryModel = require("../models/category.model.js");
const mongoose = require("mongoose");
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
        return res
          .status(RESPONSES.BAD_REQUEST)
          .json({ message: `please provide a ${key}` });
      }
    });

    if (categories && Array.isArray(categories)) {
      categories.forEach(async (category) => {
        const existingCategory = await CategoryModel.findById(category);
        if (!existingCategory) {
          return res
            .status(RESPONSES.BAD_REQUEST)
            .json({
              message: `category not found with categoryId ${category}`,
            });
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
          return res.status(RESPONSES.SUCCESS).json(data);
        }
      })
      .catch((err) => res.status(RESPONSES.SERVER_ERROR).json(err));
  } catch (error) {
    console.log(error);
    return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
  }
};

// update a feed
exports.update = (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(RESPONSES.BAD_REQUEST)
        .json({ message: "please provide a objectId" });
    }

    ArticleModel.findByIdAndUpdate(id, req.body)
      .then((data) => res.status(RESPONSES.SUCCESS).json(data))
      .catch((err) => {
        console.log(err);
        return res
          .status(RESPONSES.SERVER_ERROR)
          .json({ message: err.message });
      });
  } catch (error) {
    console.log(error);
    return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
  }
};

// find one feed
exports.findOne = (req, res, next) => {
  try {
    console.log("finding one");
    const { id } = req.params;
    if (!id) {
      return res
        .status(RESPONSES.BAD_REQUEST)
        .json({ message: "please provide a id" });
    }

    ArticleModel.findById(id)
      .then((data) => {
        if (data) {
          return res.status(RESPONSES.SUCCESS).json(data);
        }
        return res
          .status(RESPONSES.NOT_FOUND)
          .json({ message: "no such feed was found on the db" });
      })
      .catch((err) => {
        return res
          .status(RESPONSES.SERVER_ERROR)
          .json({ message: err.message });
      });
  } catch (error) {
    console.log(error);
    return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
  }
};

// find all feeds
exports.findAll = async (req, res, next) => {
  try {
    let { category, readTime } = req.query;
    const query = {};
    console.log(category);
    if (category && !Array.isArray(category)) {
      const existingCategory = await CategoryModel.findById(category);
      if (!existingCategory) {
        return res
          .status(RESPONSES.BAD_REQUEST)
          .json({ message: "category not found" });
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
      return res.status(RESPONSES.SUCCESS).json({ articles: matchedArticles });
    }

    return res.status(RESPONSES.SUCCESS).json({ articles: [] });
  } catch (error) {
    console.log(error);
    return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await ArticleModel.deleteMany({});
    return res
      .status(RESPONSES.SUCCESS)
      .json({ message: "deleted all articles" });
  } catch (error) {
    console.log(error);
    return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
  }
};

// delete one feed
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("deleting", req.params);
    if (!id) {
      return res
        .status(RESPONSES.BAD_REQUEST)
        .json({ message: "please provide a id as parameter" });
    }

    ArticleModel.findByIdAndDelete(id, req.body)
      .then((data) => {
        if (data) {
          return res
            .status(RESPONSES.SUCCESS)
            .json({ message: `deleted feed with id ${id}` });
        }

        return res
          .status(RESPONSES.NOT_FOUND)
          .json({ message: "unable to find article" });
      })
      .catch((err) => {
        return res
          .status(RESPONSES.SERVER_ERROR)
          .json({ message: err.message });
      });
  } catch (error) {
    console.log(error);
    return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
  }
};
