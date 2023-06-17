const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { SHA3 } = require("sha3");

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://users-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

const { Order } = require("./models");

const verifyJWT = require("./utils/verifyJWT");

router.post("/user/makeOrder", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.books && req.body?.destination && req.body?.paymentMethod;
        if (!hasAllFields) throw new Error("Please enter all fields");

        const order = new Order({
            books: req.body?.books,
            destination: req.body?.destination,
            paymentMethod: req.body?.paymentMethod,
            userId: frontendToken.userId,
            status: "pending",
        });

        await order.save();

        res.status(200).send({ message: "Order created" });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getOrders", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const orders = await Order.find({ userId: frontendToken.userId });

        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/admin/getAllOrders", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const orders = await Order.find({});

        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/admin/updateOrderStatus", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.orderId && req.body?.status;
        if (!hasAllFields) throw new Error("Please enter all fields");

        await Order.findByIdAndUpdate(req.body?.orderId, { status: req.body?.status });

        res.status(200).send({ message: "Order updated" });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

module.exports = router;
