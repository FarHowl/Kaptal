const mongoose = require("mongoose");

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
            type: Object,
            required: true,
            trim: true,
            default: undefined,
        },
    ],
    wishlist: [
        {
            type: Object,
            required: true,
            trim: true,
            default: undefined,
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

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
};
