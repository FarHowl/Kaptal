const express = require("express");

const router = express.Router();
const userRoutes = require("./userAPI");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const verifyJWT = require("../utils/verifyJWT");

router.post("/admin/updateUser", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://users-service:3002" + "/api/admin/updateUser",
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

router.get("/admin/getAllUsers", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin", "moderator"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.get("http://users-service:3002" + "/api/admin/getAllUsers", { headers: { Authorization: "Bearer " + newToken } });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.get("/admin/getAllBooks", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.get("http://books-service:3003" + "/api/admin/getAllBooks", { headers: { Authorization: "Bearer " + newToken } });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.post("/admin/addNewBook", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/addNewBook",
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

router.post("/admin/updateBook", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/updateBook",
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

router.post("/admin/deleteBook", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/updateBook",
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
