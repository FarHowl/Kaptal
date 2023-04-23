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

const chatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    socketId: {
        type: String,
        required: true,
        trim: true,
    },
    messages: {
        required: true,
        type: Array,
    },
    isModeratorConnected: {
        type: Boolean,
        required: true,
        default: false,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
});

const chatHistorySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    socketId: {
        type: String,
        required: true,
        trim: true,
    },
    messages: {
        required: true,
        type: Array,
    },
    isModeratorConnected: {
        type: Boolean,
        required: true,
        default: false,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
});

const orderSchema = new mongoose.Schema({
    book: [
        {
            type: bookSchema,
            required: true,
            default: [],
        },
    ],
    date: {
        type: Number,
        default: Date.now(),
    },
    status: {
        required: true,
        type: String,
        trim: true,
    },
    destination: {
        required: true,
        type: String,
        trim: true,
    },
});

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        trim: true,
        type: String,
    },
    email: {
        unique: true,
        trim: true,
        required: true,
        type: String,
    },
    password: {
        required: true,
        trim: true,
        type: String,
    },
    role: {
        required: true,
        trim: true,
        default: "user",
        type: String,
    },
    shoppingCart: [
        {
            type: bookSchema,
            default: [],
            required: true,
        },
    ],
    orders: [
        {
            type: orderSchema,
            default: [],
            required: true,
        },
    ],
    isStaffAvailableForChat: {
        required: false,
        type: Boolean,
    },
    webSocketId: {
        required: false,
        type: String,
        trim: true,
    },
});

const Book = mongoose.model("Book", bookSchema);
const Chat = mongoose.model("Chat", chatSchema);
const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
const Order = mongoose.model("Order", orderSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
    Book,
    Chat,
    ChatHistory,
    Order,
    Review,
    User,
};
