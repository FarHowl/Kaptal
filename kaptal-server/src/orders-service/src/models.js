const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    books: [
        {
            type: Object,
            required: true,
            trim: true,
        },
    ],
    date: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        required: true,
        type: String,
        trim: true,
    },
    deliveryAddress: {
        required: true,
        type: String,
        trim: true,
    },
    totalPrice: {
        required: true,
        type: Number,
        trim: true,
    },
    userId: {
        required: true,
        type: String,
        trim: true,
    },
    paymentMethod: {
        required: true,
        type: String,
        trim: true,
    },
    deliveryMethod: {
        required: true,
        type: String,
        trim: true,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = {
    Order,
};
