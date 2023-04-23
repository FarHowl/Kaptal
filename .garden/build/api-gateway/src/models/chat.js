const mongoose = require("mongoose");

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

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = {
    Chat,
    chatSchema,
};
