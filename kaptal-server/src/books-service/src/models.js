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
        type: Array,
    },
    stock: {
        required: true,
        trim: true,
        type: Number,
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
        required: false,
        trim: true,
        type: String,
    },
    cycle: {
        required: false,
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
    categories: [
        {
            type: String,
            trim: true,
            required: true,
        },
    ],
    collections: [
        {
            type: String,
            required: true,
        },
    ],
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    children: [
        {
            type: Object,
            required: true,
            default: {},
        },
    ],
});

const collectionSchema = new mongoose.Schema({
    collections: [
        {
            unique: true,
            required: true,
            trim: true,
            type: String,
        },
    ],
});

const Category = mongoose.model("Category", categorySchema);
const Collection = mongoose.model("Collection", collectionSchema);
const Book = mongoose.model("Book", bookSchema);

module.exports = {
    Book,
    Collection,
    Category,
};
