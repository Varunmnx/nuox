const { Console } = require("console");
const { RESPONSES } = require("../common/index.js");
const categoryModel = require('../models/category.model')

exports.create = async (req, res, next) => {
    try {
        const { name } = req.body
        console.log("creating  category")
        if (!name) {
            return res.status(RESPONSES.SERVER_ERROR).json({ message: "provide a category name" })
        }

        const existingName = await categoryModel.findOne({ name })
        console.log("existingname", existingName)
        if (existingName) {
            console.log("existingName", existingName)
            return res.status(RESPONSES.BAD_REQUEST).json({ message: "name is already taken" })
        }
        let categoryCreated = await new categoryModel({ name })
        categoryCreated = await categoryCreated.save()
        if (categoryCreated) {
            return res.status(RESPONSES.SUCCESS).json({ category: categoryCreated })
        }
        return res.status(RESPONSES.SERVER_ERROR).json({ message: "unable to create category" })
    } catch (error) {
        console.log(error);
        return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
    }
}


exports.delete = async (req, res, next) => {
    try {
        const { id } = req.query
        console.log("deleting", id)
        if (!id) {
            res.status(RESPONSES.SERVER_ERROR, { message: "provide a category id" })
        }
        await categoryModel.findByIdAndDelete(id)
        return res.status(RESPONSES.SUCCESS, { message: "deleted  category with id " + id })
    } catch (error) {
        console.log(error);
        return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
    }
}


exports.get = async (req, res, next) => {
    try {

        const response = await categoryModel.find({})
        return res.status(RESPONSES.SUCCESS).json({ categories: response })

    } catch (error) {
        console.log(error);
        return res.status(RESPONSES.SERVER_ERROR).json({ message: error });
    }
}