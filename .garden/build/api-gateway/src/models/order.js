const mongoose = require("mongoose");
const { bookSchema } = require("./book");

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

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
