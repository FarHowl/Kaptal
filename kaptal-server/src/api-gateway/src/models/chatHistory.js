const mongoose = require("mongoose");

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

const ChatHistory = new mongoose.model("ChatHistory", chatHistorySchema);

module.exports = {
    ChatHistory,
    chatHistorySchema,
};
