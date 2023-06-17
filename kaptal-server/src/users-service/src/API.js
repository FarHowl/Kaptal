const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { SHA3 } = require("sha3");

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://users-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

const { User } = require("./models");

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

        const frontendToken = jwt.sign({ userId: currentUser._id.toString(), role: currentUser.role }, process.env.FRONTEND_GATEWAY_KEY, { expiresIn: "100d" });

        res.status(200).send({
            username: currentUser.username,
            role: currentUser.role,
            orders: currentUser.orders,
            shoppingCart: currentUser.shoppingCart,
            authToken: frontendToken,
            userId: currentUser._id,
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/user/signUp", async (req, res) => {
    try {
        const currentToken = req.headers.authorization.split(" ")[1];

        jwt.verify(currentToken, process.env.GATEWAY_USERS_KEY);

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

router.post("/user/addToShoppingCart", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const isBookAlreadyInShoppingCart = currentUser.shoppingCart.includes(req.body.bookId);
        if (isBookAlreadyInShoppingCart) {
            const user = await User.findByIdAndUpdate(currentUser._id.toString(), {
                $inc: {
                    "shoppingCart.$.amount": 1,
                },
            });
        } else {
            const user = await User.findByIdAndUpdate(currentUser._id.toString(), {
                $push: {
                    shoppingCart: {
                        bookId: req.body.bookId,
                        amount: 1,
                    },
                },
            });
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/user/removeFromShoppingCart", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId && req.body?.amount;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        if (req.body.amount >= currentUser.shoppingCart.find((book) => book.bookId === req.body.bookId).amount) {
            await User.findByIdAndUpdate(currentUser._id.toString(), {
                $pull: {
                    shoppingCart: {
                        bookId: req.body.bookId,
                    },
                },
            });
        } else {
            await User.findByIdAndUpdate(
                currentUser._id.toString(),
                {
                    $inc: {
                        "shoppingCart.$[elem].amount": -req.body.amount,
                    },
                },
                {
                    arrayFilters: [{ "elem.bookId": req.body.bookId }],
                }
            );
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/user/addToWishlist", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const isBookAlreadyInWishlist = currentUser.wishlist.includes(req.body.bookId);
        if (!isBookAlreadyInWishlist) {
            const user = await User.findByIdAndUpdate(currentUser._id.toString(), {
                $push: {
                    wishlist: req.body.bookId,
                },
            });
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/user/removeFromWishlist", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const isBookAlreadyInWishlist = currentUser.wishlist.includes(req.body.bookId);
        if (isBookAlreadyInWishlist) {
            const user = await User.findByIdAndUpdate(currentUser._id.toString(), {
                $pull: {
                    wishlist: req.body.bookId,
                },
            });
        }

        res.sendStatus(200);
    } catch (error) {
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

        const totalAmountOfUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalAmountOfUsers / 1);
        const currentPage = parseInt(req.query.page);
        if (currentPage > totalPages) throw new Error("Undefined page");

        const amountOfUsersToSkip = (currentPage - 1) * 1;
        const users = await User.find({}, { password: 0 }).skip(amountOfUsersToSkip).limit(1);

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
