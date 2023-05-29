const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    text: {
        required: true,
        type: String,
    },
    title: {
        required: true,
        type: String,
    },
    bookRating: {
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
    reviewRating: [
        {
            userId: {
                required: true,
                trim: true,
                type: mongoose.Schema.Types.ObjectId,
            },
            isReviewUseful: {
                required: true,
                trim: true,
                type: Boolean,
            },
        },
    ],
    bookId: {
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
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
        required: true,
        type: String,
        trim: true,
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = {
    Review,
};
