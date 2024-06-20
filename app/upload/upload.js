const multer = require("multer");
const path = require("path");

// Set up disk storage to store files two directories above the current file's directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Navigate two directories up from the current file's directory and set the 'uploads' directory
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    // Set the file name to be the original file name prefixed with the field name and current timestamp
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Create the multer instance with disk storage
const upload = multer({ storage: storage });

module.exports = upload;
