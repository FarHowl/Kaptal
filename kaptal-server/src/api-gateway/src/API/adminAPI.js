const express = require("express");

const router = express.Router();
const userRoutes = require("./userAPI");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const verifyJWT = require("../utils/verifyJWT");

router.post("/users-service/admin/updateUser", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_USERS_KEY, { expiresIn: "1h" });

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
        else res.status(500).send({ error: error.message });
    }
});

router.get("/users-service/admin/getAllUsers", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["admin", "moderator"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_USERS_KEY, { expiresIn: "1h" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://users-service:3000" + "/api/admin/getAllUsers" + query, { headers: { Authorization: "Bearer " + newToken } });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/books-service/admin/getAllBooks", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://books-service:3000" + "/api/admin/getAllBooks" + query, { headers: { Authorization: "Bearer " + newToken } });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.post("/books-service/admin/addNewBook", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h" });

        const response = await axios.post(
            "http://books-service:3000" + "/api/admin/addNewBook",
            {
                ...req.body,
            },
            {
                data: req.files,
                headers: {
                    Authorization: "Bearer " + newToken,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.post("/books-service/admin/updateBook", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["admin"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h" });

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
        else res.status(500).send({ error: error.message });
    }
});

router.post("/books-service/admin/deleteBook", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["admin"]);

        const newTokenForBooks = jwt.sign({ frontendToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h" });
        const newTokenForReviews = jwt.sign({ frontendToken }, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "1h" });

        const response1 = axios.post("http://books-service:3000" + "/api/admin/deleteBook", { ...req.body }, { headers: { Authorization: "Bearer " + newTokenForBooks } });
        const response2 = axios.post("http://reviews-service:3000" + "/api/admin/deleteBookReviews", { ...req.body }, { headers: { Authorization: "Bearer " + newTokenForReviews } });

        const response = await axios.all([response1, response2]);
        res.status(200);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/reviews-service/moderator/getUncheckedReviews", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["moderator", "admin"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "1h" });

        const response = await axios.get("http://reviews-service:3000" + "/api/moderator/getUncheckedReviews", { headers: { Authorization: "Bearer " + newToken } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.post("/reviews-service/moderator/checkReview", async (req, res) => {
    try {
        const frontendToken = verifyJWT(req, ["moderator", "admin"]);

        const newToken = jwt.sign({ frontendToken }, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "1h" });

        const response = await axios.post("http://reviews-service:3000" + "/api/moderator/checkReview", { ...req.body }, { headers: { Authorization: "Bearer " + newToken } });

        res.sendStatus(200);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.use(userRoutes);

module.exports = router;
