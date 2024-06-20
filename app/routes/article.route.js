const article = require("../controllers/article.controller.js");
const express = require("express");
const router = express.Router();

// Define the routes
router.route("/").post(article.create).get(article.findAll);
router
  .route("/:id")
  .get(article.findOne)
  .put(article.update)
  .delete(article.delete);

module.exports = router;
