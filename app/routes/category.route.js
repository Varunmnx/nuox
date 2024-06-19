const category = require("../controllers/category.controller.js");
const express = require("express");
const router = express.Router();

router.route('/')
    .get(category.get)
    .post(category.create)
    .delete(category.delete);


module.exports = router;