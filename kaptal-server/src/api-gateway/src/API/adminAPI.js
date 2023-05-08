const express = require("express");

const router = express.Router();
const userRoutes = require("./userAPI");

const verifyJWT = require("../utils/verifyJWT");

router.post("/admin/updateUser", async (req, res) => {
    try {
        await verifyJWT(req, ["admin"]);

        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_USERS_KEY, { expiresIn: "1h"});

        const response = await axios.post(
            "http://users-service:3002" + "/api/admin/updateUser",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.get("/admin/getAllUsers", async (req, res) => {
    try {
        await verifyJWT(req, ["admin", "moderator"]);

        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_USERS_KEY, { expiresIn: "1h"});

        const response = await axios.post(
            "http://users-service:3002" + "/api/admin/updateUser",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.get("/admin/getAllBooks", async (req, res) => {
    try {
        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h"});

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/getAllBooks",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.post("/admin/addNewBook", async (req, res) => {
    try {
        await verifyJWT(req, ["admin"]);

        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h"});

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/addNewBook",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.post("/admin/updateBook", async (req, res) => {
    try {
        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h"});

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/updateBook",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.post("/admin/deleteBook", async (req, res) => {
    try {
        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_BOOKS_KEY, { expiresIn: "1h"});

        const response = await axios.post(
            "http://books-service:3003" + "/api/admin/updateBook",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.use(userRoutes);

module.exports = router;
