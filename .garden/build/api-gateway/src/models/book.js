const mongoose = require("mongoose");
const { reviewSchema } = require("./review");

const bookSchema = new mongoose.Schema({
    name: {
        required: true,
        trim: true,
        type: String,
    },
    author: {
        required: true,
        trim: true,
        type: String,
    },
    genres: {
        required: true,
        trim: true,
        type: Array,
    },
    isAvailable: {
        required: true,
        trim: true,
        type: Boolean,
    },
    coverType: {
        required: true,
        trim: true,
        type: String,
    },
    publisher: {
        required: true,
        trim: true,
        type: String,
    },
    series: {
        required: true,
        trim: true,
        type: String,
    },
    language: {
        required: true,
        trim: true,
        type: String,
    },
    size: {
        required: true,
        trim: true,
        type: String,
    },
    weight: {
        required: true,
        trim: true,
        type: Number,
    },
    ISBN: {
        required: true,
        trim: true,
        unique: true,
        type: String,
    },
    pagesCount: {
        required: true,
        trim: true,
        type: Number,
    },
    ageLimit: {
        required: true,
        trim: true,
        type: Number,
    },
    year: {
        required: true,
        trim: true,
        type: Number,
    },
    circulation: {
        required: true,
        trim: true,
        type: Number,
    },
    annotation: {
        required: true,
        trim: true,
        type: String,
    },
    reviews: [
        {
            type: reviewSchema,
            required: true,
            default: [],
        },
    ],
    rating: {
        required: true,
        trim: true,
        default: 0,
        type: Number,
    },
    ratingCount: {
        required: true,
        trim: true,
        default: 0,
        type: Number,
    },
    discount: {
        required: true,
        trim: true,
        default: 0,
        type: Number,
    },
    price: {
        required: true,
        trim: true,
        type: Number,
    },
    image: {
        required: true,
        type: String,
    },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = {
    Book,
    bookSchema,
};