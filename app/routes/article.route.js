const article = require("../controllers/article.controller.js");
const express = require("express");
const router = express.Router();

// Define the routes
router.post("/", article.create);
router.get("/", article.findAll);
router.get("/:id", article.findOne);
router.put("/:id", article.update);
router.delete("/:id", article.delete);

module.exports = router;