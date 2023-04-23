const mongoose = require("mongoose");
const { bookSchema } = require("./book");
const { orderSchema } = require("./order");

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

module.exports = mongoose.model("User", userSchema);