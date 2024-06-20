const upload = require("../upload/upload.js");
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
router.post("/", upload.single("media"), async (req, res) => {
  try {
    // Upload image to Cloudinary
    console.log("uploading");
    console.log(req.file);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "media",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) {
        return res.status(500).send("Error deleting file.");
      }

      return res.json({
        imageUrl: result.secure_url,
        message: "image uploaded",
      });
    });

    // Send the Cloudinary URL in the response
    // return res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error uploading image to Cloudinary" });
  }
});

module.exports = router;
