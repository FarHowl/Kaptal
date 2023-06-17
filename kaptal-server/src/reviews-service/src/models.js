const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    text: {
        required: false,
        type: String,
    },
    title: {
        required: false,
        type: String,
    },
    bookRating: {
        required: true,
        type: Number,
    },
    author: {
        required: false,
        type: String,
    },
    publicationDate: {
        required: false,
        type: String,
    },
    reviewRating: {
        type: [
            {
                userId: {
                    required: false,
                    trim: true,
                    type: String,
                },
                isReviewUseful: {
                    required: false,
                    trim: true,
                    type: Boolean,
                },
            },
        ],
        default: undefined,
    },
    bookId: {
        required: true,
        trim: true,
        type: String,
    },
    pros: {
        required: false,
        type: String,
        trim: true,
    },
    cons: {
        required: false,
        type: String,
        trim: true,
    },
    status: {
        required: false,
        type: String,
        trim: true,
    },
    userId: {
        required: true,
        trim: true,
        type: String,
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = {
    Review,
};
