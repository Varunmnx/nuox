const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  publicUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", mediaSchema);
