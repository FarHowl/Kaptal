const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    text: {
        required: true,
        type: String,
    },
    rating: {
        required: true,
        type: Number,
    },
    author: {
        required: true,
        type: String,
    },
    publicationDate: {
        required: true,
        type: String,
    },
    likes: {
        required: true,
        default: 0,
        type: Number,
    },
    dislikes: {
        required: true,
        default: 0,
        type: Number,
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = {
    Review,
    reviewSchema,
};
