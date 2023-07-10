const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { SHA3 } = require("sha3");
const axios = require("axios");


const { Order } = require("./models");

const verifyJWT = require("./utils/verifyJWT");

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://users-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

router.post("/user/makeOrder", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);
        const currentToken = req.headers.authorization.split(" ")[1];

        const hasAllFields =
            req.body?.books &&
            req.body?.deliveryAddress &&
            req.body?.paymentMethod &&
            req.body?.deliveryMethod &&
            req.body?.phoneNumber &&
            req.body?.email &&
            req.body?.firstName &&
            req.body?.lastName;
        if (!hasAllFields) throw new Error("Пожалуйста, введите все поля");

        let orderDate = new Date();
        const day = orderDate.getDate();
        const month = orderDate.getMonth() + 1;
        const year = orderDate.getFullYear();
        const time = orderDate.getHours() + ":" + orderDate.getMinutes();
        orderDate = day + "." + month + "." + year + " " + time;

        const order = new Order({
            books: req.body?.books,
            deliveryAddress: req.body?.deliveryAddress,
            deliveryMethod: req.body?.deliveryMethod,
            paymentMethod: req.body?.paymentMethod,
            userId: frontendToken.userId,
            date: orderDate,
            status: "created",
        });

        let response;
        const newTokenForBooks = jwt.sign({ gatewayToken: currentToken }, process.env.ORDERS_BOOKS_KEY, { expiresIn: "1h" });
        const newTokenForUsers = jwt.sign({ gatewayToken: currentToken }, process.env.ORDERS_USERS_KEY, { expiresIn: "1h" });
        const response1 = axios.post("http://users-service:3000/api/service/clearShoppingCart", { userId: frontendToken.userId }, { headers: { Authorization: "Bearer " + newTokenForUsers } });
        const response2 = axios.post("http://books-service:3000/api/service/makeOrder", { ...req.body }, { headers: { Authorization: "Bearer " + newTokenForBooks } });

        response = await axios.all([response1, response2]);

        if (!response[0].data?.dataWasChanged && !response[1].data?.dataWasChanged) {
            throw new Error("Ошибка при создании заказа");
        } else if (response[0].data?.dataWasChanged && !response[1].data?.dataWasChanged) {
            await axios.post("http://users-service:3000/api/service/clearShoppingCart", { userId: frontendToken.userId, rollback: true }, { headers: { Authorization: "Bearer " + newTokenForUsers } });
            throw new Error("Ошибка при создании заказа");
        } else if (response[1].data?.dataWasChanged && !response[0].data?.dataWasChanged) {
            await axios.post("http://books-service:3000/api/service/makeOrder", { ...req.body, rollback: true }, { headers: { Authorization: "Bearer " + newTokenForBooks } });
            throw new Error("Ошибка при создании заказа");
        } else await order.save();

        res.status(200).send({ message: "Заказ создан" });
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
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

        const order = await Order.findByIdAndUpdate(req.body?.orderId, { status: req.body?.status });
        if (!order) throw new Error("Order does not exist");

        res.status(200).send({ message: "Статус заказа обновлен" });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

module.exports = router;
