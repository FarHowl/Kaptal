const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyJWT = require("../utils/verifyJWT.js");

const axios = require("axios");

//Sign in
router.post("/users-service/user/signIn", async (req, res) => {
    try {
        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://users-service:3000" + "/api/user/signIn",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.post("/users-service/user/signUp", async (req, res) => {
    try {
        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://users-service:3000" + "/api/user/signUp",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});
router.get("/books-service/user/getBookData", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://books-service:3000" + "/api/user/getBookData" + query, { headers: { Authorization: "Bearer " + token } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/books-service/user/searchBook", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://books-service:3000" + "/api/user/searchBook" + query, { headers: { Authorization: "Bearer " + token } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/books-service/user/getAllCategories", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.get("http://books-service:3000" + "/api/user/getAllCategories", { headers: { Authorization: "Bearer " + token } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/books-service/user/getAllCollections", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.get("http://books-service:3000" + "/api/user/getAllCollections", { headers: { Authorization: "Bearer " + token } });

        res.status(200).send(response.data);
    } catch (error) {
        console.log(error);
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.post("/reviews-service/user/addRating", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin", "user", "moderator"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post("http://reviews-service:3000" + "/api/user/addRating", { ...req.body }, { headers: { Authorization: "Bearer " + newToken } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.post("/reviews-service/user/addReview", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin", "user", "moderator"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "100d" });

        await axios.post("http://reviews-service:3000" + "/api/user/addReview", { ...req.body }, { headers: { Authorization: "Bearer " + newToken } });

        res.sendStatus(200);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/reviews-service/user/getBookReviews", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "100d" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://reviews-service:3000" + "/api/user/getBookReviews" + query, { headers: { Authorization: "Bearer " + token } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/reviews-service/user/getBookRating", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "100d" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://reviews-service:3000" + "/api/user/getBookRating" + query, { headers: { Authorization: "Bearer " + token } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

router.get("/books-service/user/getBookImage", async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const query = "?" + req.originalUrl.split("?")[1];

        const response = await axios.get("http://books-service:3000" + "/api/user/getBookImage" + query, { headers: { Authorization: "Bearer " + token }, responseType: "arraybuffer" });

        res.set("Content-Type", "image");

        res.send(Buffer.from(response.data, "binary"));
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.error });
        else res.status(500).send({ error: error.message });
    }
});
// router.get("/user/getAvailableStaff", async (req, res) => {
//     try {
//         verifyJWT(req, ["user"]);

//         const response = await axios.post("", {
//             ...req.body,
//         });
//         res.status(200).send(response.data);
//     } catch (error) {
//         res.status(500).send({ error: error.response.data.error });
//     }
// });

module.exports = router;
