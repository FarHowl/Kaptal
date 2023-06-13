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
    userId: {
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
    }
});

const ratingSchema = new mongoose.Schema({
    userId: {
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
    },
    bookRating: {
        required: true,
        trim: true,
        type: Number,
    },
    bookId: {
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
    },
});

const Review = mongoose.model("Review", reviewSchema);
const Rating = mongoose.model("Rating", ratingSchema);

module.exports = {
    Review,
    Rating,
};
