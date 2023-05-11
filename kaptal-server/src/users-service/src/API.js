const express = require("express");

const { User } = require("./models");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { SHA3 } = require("sha3");
const verifyJWT = require("./utils/verifyJWT");

router.post("/user/signIn", async (req, res) => {
    try {
        const currentToken = req.headers.authorization.split(" ")[1];
        
        jwt.verify(currentToken, process.env.GATEWAY_USERS_KEY);

        const findUserOrValidEmail = await User.findOne({ email: req.body.email });
        if (!findUserOrValidEmail) throw new Error("User does not exist or email is invalid");

        const currentUser = await User.findOne({ email: req.body.email });
        const hash = new SHA3(512);
        const passwordHash = hash.update(req.body.password).digest("hex");
        const isPasswordValid = currentUser.password !== passwordHash;
        if (isPasswordValid) throw new Error("Password is invalid");

        const frontendToken = jwt.sign({ _id: currentUser._id.toString(), role: currentUser.role }, process.env.FRONTEND_GATEWAY_KEY, { expiresIn: "100d" });

        res.status(200).send({ username: currentUser.username, role: currentUser.role, orders: currentUser.orders, shoppingCart: currentUser.shoppingCart, authToken: frontendToken, userId: currentUser._id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/user/signUp", async (req, res) => {
    try {
        const hasAllFields = req.body?.username || req.body?.email || req.body?.password;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const hash = new SHA3(512);
        const passwordHash = hash.update(req.body.password).digest("hex");

        const userData = new User({
            username: req.body.username,
            email: req.body.email,
            password: passwordHash,
            shoppingCart: [],
        });

        await userData.save();
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
});

router.post("/admin/updateUser", async (req, res) => {
    try {
        verifyJWT(req);

        const hasUserId = req.body?.userId;
        if (!hasUserId) throw new Error("Please, enter userId");

        const currentUser = await User.findById(req.body.userId);

        let update = {};

        const hasChangeRoleTo = req.body?.role !== undefined;
        if (hasChangeRoleTo && req.body.role === currentUser.role) throw new Error("You have entered the same role");

        if (currentUser.role === "user" && req.body.role === "moderator") {
            update.isStaffAvailableForChat = true;
        } else if (req.body.role === "user") {
            update.$unset = { isStaffAvailableForChat: "" };
        }
        update.role = req.body.role;

        const user = await User.findByIdAndUpdate(currentUser._id.toString(), update);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get("/admin/getAllUsers", async (req, res) => {
    try {
        verifyJWT(req);

        const users = await User.find({}, { password: 0 });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: "Something went wrong" });
    }
});

module.exports = router;
