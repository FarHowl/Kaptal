const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyJWT = require("../utils/verifyJWT.js");

const axios = require("axios");

//Sign in
router.post("/user/signIn", async (req, res) => {
    try {
        const hasAllFields = req.body?.email || req.body?.password;
        if (!hasAllFields) throw new Error("Enter all fields");
        const token = jwt.sign({ email: req.body.email }, process.env.GATEWAY_USERS_KEY, { expiresIn: "100d" });

        const response = await axios.post(
            "http://users-service:3002" + "/api/user/signIn",
            {
                ...req.body,
            },
            { headers: { Authorization: "Bearer " + token } }
        );
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
    }
});

router.post("/user/signUp", async (req, res) => {
    try {
        const response = await axios.post("http://users-service:3002" + "/api/user/signUp", {
            ...req.body,
        });
        res.status(200).send(response.data);
    } catch (error) {
        if (error?.response) res.status(500).send({ error: error.response.data.error });
        else console.log(error);
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
