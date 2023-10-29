const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { SHA3 } = require("sha3");
const nodemailer = require("nodemailer");

const { User } = require("./models");

const verifyJWT = require("./utils/verifyJWT");

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://users-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

router.get("/user/refreshToken", async (req, res) => {
    try {
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

        const { firstName, phoneNumber, email, lastName, code } = req.body;
        const hasAllFields = firstName && phoneNumber && email && lastName && code;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const originalCode = JSON.parse(await redisClient.get(email));

        if (code === originalCode.code) {
            const userData = new User({
                email,
                firstName,
                lastName,
                phoneNumber,
            });

            await userData.save();

            const frontendToken = jwt.sign({ userId: userData._id.toString(), role: userData.role }, process.env.FRONTEND_GATEWAY_KEY, { expiresIn: "1d" });

            res.status(200).send({
                firstName: userData.firstName,
                role: userData.role,
                authToken: frontendToken,
                userId: userData._id,
            });
        } else throw new Error("Code is invalid");
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
});

router.post("/user/checkEmailCode", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const clientCode = req.body?.code;
        const email = req.body?.email;

        const hasAllFields = clientCode && email;
        if (!hasAllFields) throw new Error("Enter all fields");

        const originalCode = JSON.parse(await redisClient.get(email));
        if (originalCode?.availableAttempts === 0) {
            redisClient.del(email);
            throw new Error("You have exceeded the number of attempts");
        }

        if (clientCode !== originalCode?.code) {
            const stringToSave = JSON.stringify({ code: originalCode.code, availableAttempts: originalCode.availableAttempts - 1 });

            await redisClient.set(email, stringToSave, "EX", 60 * 5);
            throw new Error("Code invalid");
        } else {
            const currentUser = await User.findOne({ email: req.body.email });

            if (currentUser) {
                const frontendToken = jwt.sign({ userId: currentUser._id.toString(), role: currentUser.role }, process.env.FRONTEND_GATEWAY_KEY, { expiresIn: "1d" });

                res.status(200).send({
                    firstName: currentUser.firstName,
                    role: currentUser.role,
                    authToken: frontendToken,
                    userId: currentUser._id,
                });
            } else {
                res.status(200).send({ message: "User does not exist" });
            }
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/sendEmailCode", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const email = req.body?.email;
        if (!email) throw new Error("Please, enter email");

        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }

        const stringToSave = JSON.stringify({ code, availableAttempts: 5 });
        await redisClient.set(email, stringToSave, "EX", 60 * 5);

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
        console.log(error);
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

        const hasAllFields = req.body?.bookId && req.body?.amount;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const currentUser = await User.findById(frontendToken.userId);
        const bookIndex = currentUser.shoppingCart.findIndex((book) => book.bookId === req.body.bookId);

        if (bookIndex === -1) throw new Error("Book not found in the shopping cart");

        if (req.body.amount === 1) {
            if (currentUser.shoppingCart[bookIndex].amount === 1) {
                currentUser.shoppingCart.splice(bookIndex, 1);
            } else {
                currentUser.shoppingCart[bookIndex].amount -= 1;
            }
        } else if (req.body.amount === "all") {
            currentUser.shoppingCart.splice(bookIndex, 1);
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
            const user = await User.findByIdAndUpdate(currentUser._id.toString(), {
                $push: {
                    wishlist: {
                        bookId: req.body.bookId,
                    },
                },
            });

            if (!user) throw new Error("User does not exist");
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
            const user = await User.findByIdAndUpdate(currentUser._id.toString(), {
                $pull: {
                    wishlist: { bookId: req.body.bookId },
                },
            });

            if (!user) throw new Error("User does not exist");
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getUserData", async (req, res) => {
    const hasToBeAuthorized = true;
    const frontendToken = verifyJWT(req, hasToBeAuthorized);

    const currentUser = await User.findById(frontendToken.userId, { role: 0, shoppingCart: 0, wishlist: 0, isStaffAvailableForChat: 0, webSocketId: 0 });

    res.status(200).send(currentUser);
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

        const user = await User.findByIdAndUpdate(currentUser._id.toString(), update);
        if (!user) throw new Error("User does not exist");
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

router.post("/service/clearShoppingCart", async (req, res) => {
    let dbRequestWasDone = false;

    try {
        const currentToken = req.headers.authorization.split(" ")[1];
        const parentToken = jwt.decode(currentToken);

        if (parentToken?.gatewayToken) {
            jwt.verify(currentToken, process.env.ORDERS_USERS_KEY);

            jwt.verify(parentToken?.gatewayToken, process.env.GATEWAY_ORDERS_KEY);

            const { frontendToken } = jwt.decode(parentToken?.gatewayToken);
            jwt.verify(frontendToken, process.env.FRONTEND_GATEWAY_KEY);

            const { userId } = jwt.decode(frontendToken);

            if (req.body?.rollback) {
                const userShoppingCart = JSON.parse(await redisClient.get(userId + "-user-shoppingCart"));
                if (!userShoppingCart) throw new Error();

                const user = await User.findByIdAndUpdate(userId, { shoppingCart: userShoppingCart });
                if (!user) throw new Error("User does not exist");
            } else {
                const user = await User.findById(userId);
                if (!user) throw new Error("User does not exist");

                let userShoppingCart = user.shoppingCart.slice();
                user.shoppingCart = [];

                await redisClient.set(userId + "-user-shoppingCart", JSON.stringify(userShoppingCart), "EX", 30);

                await user.save();
                dbRequestWasDone = true;
            }
        } else if (parentToken?.frontendToken) {
            throw new Error("Access denied");
        }

        res.status(200).send({ dbRequestWasDone });
    } catch (error) {
        res.status(200).send({ error: error.message, dbRequestWasDone });
        console.log(error);
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
