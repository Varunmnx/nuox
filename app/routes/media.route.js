const upload = require('../upload/upload.js')
const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2

router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Upload image to Cloudinary
        console.log("uploading")
        console.log(req.file)
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'media'
        });

        // Send the Cloudinary URL in the response
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading image to Cloudinary' });
    }
});

module.exports = router;