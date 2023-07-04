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

        const hasAllFields = req.body?.books && req.body?.deliveryAddress && req.body?.paymentMethod && req.body?.deliveryMethod;
        if (!hasAllFields) throw new Error("Пожалуйста, введите все поля");

        let orderDate = new Date();
        const day = orderDate.getDate();
        const month = orderDate.getMonth() + 1;
        const year = publicationDate.getFullYear();
        orderDate = day + "." + month + "." + year;

        const order = new Order({
            books: req.body?.books,
            deliveryAddress: req.body?.deliveryAddress,
            deliveryMethod: req.body?.deliveryMethod,
            paymentMethod: req.body?.paymentMethod,
            userId: frontendToken.userId,
            date: orderDate,
            status: "created",
        });

        await order.save();

        res.status(200).send({ message: "Заказ создан" });
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
        if (!hasAllFields) throw new Error("Пожалуйста, введите все поля");

        await Order.findByIdAndUpdate(req.body?.orderId, { status: req.body?.status });

        res.status(200).send({ message: "Статус заказа обновлен" });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

module.exports = router;
