const multer = require('multer')
const storage = multer.diskStorage({ path: './uploads' })  // store image in memory
const upload = multer({ storage: storage })


module.exports = upload;