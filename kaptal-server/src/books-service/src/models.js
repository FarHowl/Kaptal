const mongoose = require("mongoose");

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
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            default: "",
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        default: null,
    },
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
        },
    ],
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
});

const collectionSchema = new mongoose.Schema({
    name: {
        required: true,
        trim: true,
        type: String,
    },
});

const Category = mongoose.model("Category", categorySchema);
const Collection = mongoose.model("Collection", collectionSchema);
const Book = mongoose.model("Book", bookSchema);

module.exports = {
    Book,
    Collection,
    Category,
};
