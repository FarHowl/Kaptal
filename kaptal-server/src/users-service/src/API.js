const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { SHA3 } = require("sha3");
const nodemailer = require("nodemailer");

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
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const currentUser = await User.findOne({ email: req.body.email });
        if (!currentUser) throw new Error("User does not exist or email is invalid");

        const hash = new SHA3(512);
        const passwordHash = hash.update(req.body.password).digest("hex");
        const isPasswordValid = currentUser.password !== passwordHash;
        if (isPasswordValid) throw new Error("Password is invalid");

        const frontendToken = jwt.sign({ userId: currentUser._id.toString(), role: currentUser.role }, process.env.FRONTEND_GATEWAY_KEY, { expiresIn: "1d" });

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
        console.log(error);
    }
});

router.get("/user/refreshToken", async (req, res) => {
    try {
        console.log("first");
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const newFrontendToken = jwt.sign({ userId: frontendToken.userId.toString(), role: frontendToken.role }, process.env.FRONTEND_GATEWAY_KEY, { expiresIn: "1d" });

        res.status(200).send({
            authToken: newFrontendToken,
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/signUp", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

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

// router.post("/user/signIn", async (req, res) => {});

router.post("/user/sendEmailCode", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const email = req.body?.email;
        if (!email) throw new Error("Please, enter email");

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        redisClient.set(email, code, "EX", 60);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kartashov104@gmail.com",
                pass: "xtaeqiicczysbdol",
            },
        });

        await transporter.sendMail({
            from: "kartashov104@gmail.com",
            to: email,
            subject: "Код для входа",
            text: `Ваш код для входа на Каптал: ${code}`,
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/user/addBookToShoppingCart", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const existingBookIndex = currentUser.shoppingCart.findIndex((book) => book.bookId === req.body.bookId);

        if (existingBookIndex !== -1) {
            console.log(currentUser.shoppingCart[existingBookIndex].amount);
            currentUser.shoppingCart[existingBookIndex].amount += 1;
            console.log(currentUser.shoppingCart[existingBookIndex].amount);
        } else {
            const newBook = {
                bookId: req.body.bookId,
                amount: 1,
            };
            currentUser.shoppingCart.push(newBook);
        }

        currentUser.markModified("shoppingCart");
        await currentUser.save();

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/removeBookFromShoppingCart", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const bookIndex = currentUser.shoppingCart.findIndex((book) => book.bookId === req.body.bookId);

        if (bookIndex === -1) throw new Error("Book not found in the shopping cart");

        if (currentUser.shoppingCart[bookIndex].amount === 1) {
            currentUser.shoppingCart.splice(bookIndex, 1);
        } else {
            currentUser.shoppingCart[bookIndex].amount -= 1;
        }

        currentUser.markModified("shoppingCart");
        await currentUser.save();

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/user/addBookToWishlist", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const isBookAlreadyInWishlist = currentUser.wishlist.includes(req.body.bookId);
        if (!isBookAlreadyInWishlist) {
            await User.findByIdAndUpdate(currentUser._id.toString(), {
                $push: {
                    wishlist: {
                        bookId: req.body.bookId,
                    },
                },
            });
        } else throw new Error("Book is already in wishlist");

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/removeBookFromWishlist", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const isBookAlreadyInWishlist = currentUser.wishlist.some((book) => book.bookId === req.body.bookId);
        if (isBookAlreadyInWishlist) {
            await User.findByIdAndUpdate(currentUser._id.toString(), {
                $pull: {
                    wishlist: { bookId: req.body.bookId },
                },
            });
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getWishlist", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const currentUser = await User.findById(frontendToken.userId);

        res.status(200).send(currentUser.wishlist);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get("/user/getShoppingCart", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const currentUser = await User.findById(frontendToken.userId);

        res.status(200).send(currentUser.shoppingCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/admin/updateUser", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        if (!frontendToken.userId) {
            throw new Error("Please enter userId");
        }

        const currentUser = await User.findById(frontendToken.userId);
        if (!currentUser) {
            throw new Error("User not found");
        }

        const { role } = req.body;

        if (role === currentUser.role) {
            throw new Error("You have entered the same role");
        }

        let update = { role };

        if (currentUser.role === "user" && role === "moderator") {
            update.isStaffAvailableForChat = true;
        } else if (role === "user") {
            update.$unset = { isStaffAvailableForChat: "" };
        }

        await User.findByIdAndUpdate(currentUser._id.toString(), update);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get("/admin/getAllUsers", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

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

// router.post("/server/synchronizeShoppingCart", async (req, res) => {
//     try {
//         const currentToken = req.headers.authorization.split(" ")[1];
//         jwt.verify(currentToken, process.env.GATEWAY_USERS_KEY);
//         const serverCommand = jwt.decode(currentToken)?.serverCommand;

//         if (!serverCommand) throw new Error("Access denied");

//         const { bookId, stock, price, author, name } = req.body;
//         const image = req.files.image;

//         const users = await User.find({});

//         for (const user of users) {
//             const bookIndex = user.shoppingCart.findIndex((book) => book.bookId === bookId);

//             if (bookIndex !== -1) {
//                 if (stock !== undefined) user.shoppingCart[bookIndex].stock = stock;
//                 if (image !== undefined) user.shoppingCart[bookIndex].image = image;
//                 if (price !== undefined) user.shoppingCart[bookIndex].price = price;
//                 if (author !== undefined) user.shoppingCart[bookIndex].author = author;
//                 if (name !== undefined) user.shoppingCart[bookIndex].name = name;
//             }
//             user.markModified("shoppingCart");
//             await user.save();
//         }

//         res.sendStatus(200);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

module.exports = router;
