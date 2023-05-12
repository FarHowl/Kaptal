const express = require("express");

const router = express.Router();
const userRoutes = require("./userAPI");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const verifyJWT = require("../utils/verifyJWT");

router.post("/users-service/admin/updateUser", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://users-service:3000" + "/api/admin/updateUser",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + newToken } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.get("/users-service/admin/getAllUsers", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin", "moderator"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.get("http://users-service:3000" + "/api/admin/getAllUsers", { headers: { Authorization: "Bearer " + newToken } });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.get("/books-service/admin/getAllBooks", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://books-service:3000" + "/api/admin/getAllBooks" + query, { headers: { Authorization: "Bearer " + newToken } });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.post("/books-service/admin/addNewBook", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://books-service:3000" + "/api/admin/addNewBook",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + newToken } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.post("/books-service/admin/updateBook", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://books-service:3000" + "/api/admin/updateBook",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + newToken } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.post("/books-service/admin/deleteBook", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://books-service:3000" + "/api/admin/updateBook",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + newToken } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.use(userRoutes);

module.exports = router;
