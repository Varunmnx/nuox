const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    readTime: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
    ],
    image: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    newest: {
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Article', articleSchema);