const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyJWT = require("../utils/verifyJWT.js");

const axios = require("axios");

//Sign in
router.post("/user/signIn", async (req, res) => {
    try {
        console.log(process.env.PRIVATE_KEY_FOR_USERS);
        const hasAllFields = req.body?.email || req.body?.password;
        if (!hasAllFields) throw new Error("Enter all fields");
        const token = jwt.sign({ email: req.body.email }, process.env.PRIVATE_KEY_FOR_USERS, { expiresIn: "1h", algorithm: "RS256" });

        const response = await axios.post(
            process.env.USERS_SERVICE_URL + "/api/user/signIn",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.response.data.error });
    }
});

router.post("/user/signUp", async (req, res) => {
    try {
        const response = await axios.post(process.env.USERS_SERVICE_URL + "/api/user/signUp", {
            ...req.body,
        });
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

router.get("/book/getBookImage", async (req, res) => {
    try {
        const parsedURL = url.parse(req.url, true);
        const imgName = parsedURL.query.imgName;

        res.set({ "Content-Type": "image/png" });
        res.sendFile("C:/Users/dima3/OneDrive/Документы/GitHub/KaptalServer/src/images/booksImages/" + imgName);
    } catch (error) {
        console.log(error);
        res.send(500, { error: error.message });
    }
});

router.get("/user/getAvailableStaff", async (req, res) => {
    try {
        await verifyJWT(req, ["user"]);

        const response = await axios.post("", {
            ...req.body,
        });
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response.data.error });
    }
});

module.exports = router;
