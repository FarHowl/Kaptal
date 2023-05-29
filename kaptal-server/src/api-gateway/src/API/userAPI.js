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

router.post("/books-service/user/addRating", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin", "user", "moderator"]);

        const newToken = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        const response = await axios.post("http://books-service:3000" + "/api/user/addRating", { ...req.body }, { headers: { Authorization: "Bearer " + newToken } });

        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else res.status(500).send({ error: error.message });
    }
});

// router.get("/books-service/user/getAllCategories", async (req, res) => {
//     try {
//         const token = jwt.sign({}, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

//         const query = "?" + req.originalUrl.split("?")[1];

//         const response = await axios.get("http://books-service:3000" + "/api/user/getAllCategories" + query, { headers: { Authorization: "Bearer " + token } });
//         res.status(200).send(response.data);
//     } catch (error) {
//         if (error?.response) res.status(500).send({ error: error.response.data.error });
//         else console.log(error);

//         console.log(error);
//     }
// });

router.post("/reviews-service/user/addReview", async (req, res) => {
    try {
        const parentToken = verifyJWT(req, ["admin"]);

        const newTokenForReviews = jwt.sign({ parentToken }, process.env.GATEWAY_REVIEWS_KEY, { expiresIn: "100d" });
        const newTokenForBooks = jwt.sign({ parentToken }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "100d" });

        await axios.post("http://reviews-service:3000" + "/api/user/addReview", { ...req.body }, { headers: { Authorization: "Bearer " + newTokenForReviews } });
        await axios.post("http://books-service:3000" + "/api/user/addRating", { bookId: req.body?.bookId, rating: req.body?.rating }, { headers: { Authorization: "Bearer " + newTokenForBooks } });

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

// router.get("/book/getBookImage", async (req, res) => {
// try {
//     const parsedURL = url.parse(req.url, true);
//     const imgName = parsedURL.query.imgName;

//     res.set({ "Content-Type": "image/png" });
//     res.sendFile("C:/Users/dima3/OneDrive/Документы/GitHub/KaptalServer/src/images/booksImages/" + imgName);
// } catch (error) {
//     res.send(500, { error: error.message });
// }
//     try {
//         const response = await axios.get("http://books-service:3003" + "/api/book/getBookImage", {
//             ...req.body,
//         });
//         res.status(200).send(response.data);
//     } catch (error) {
//         res.status(500).send({ error: error.response.data.error });
//     }
// });

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
