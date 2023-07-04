const express = require("express");
const { SHA3 } = require("sha3");
const jwt = require("jsonwebtoken");
const url = require("url");
const router = express.Router();

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://books-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

const Minio = require("minio");

const verifyJWT = require("./utils/verifyJWT");

const { Book, Category, Collection } = require("./models");

router.get("/admin/getAllBooks", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const totalStockOfBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalStockOfBooks / 40);
        const currentPage = parseInt(req.query.page);
        if (currentPage > totalPages) throw new Error("Такой страницы не существует");

        const stockOfBooksToSkip = (currentPage - 1) * 40;
        const foundBooks = await Book.find().skip(stockOfBooksToSkip).limit(40);

        res.status(200).send({ books: foundBooks, totalPages });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/admin/addNewBook", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        console.log(req.body.collections);

        const hasAllFields =
            req.body?.name ||
            req.body?.author ||
            req.body?.coverType ||
            req.body?.publisher ||
            req.body?.size ||
            req.body?.ISBN ||
            req.body?.pagesCount ||
            req.body?.ageLimit ||
            req.body?.year ||
            req.body?.circulation ||
            req.body?.annotation ||
            req.body?.price ||
            req.files?.image ||
            req.body?.weight ||
            req.body?.stock ||
            req.body?.categories ||
            req.body?.collections;
        if (!hasAllFields) throw new Error("Введите все поля");

        async function addOrUpdateCategory(categoryNames) {
            const allCategories = await Category.find();
            let currentCategoryList = allCategories;
            let upperCategoryExists = false;
            let categoryBuffer = {};

            for (const category of allCategories) {
                if (category.name === categoryNames[0]) {
                    upperCategoryExists = true;
                    categoryBuffer = category;
                    currentCategoryList = categoryBuffer.children;
                    break;
                }
            }

            if (!upperCategoryExists) {
                const newCategory = new Category({ name: categoryNames[0], children: [] });
                await newCategory.save();
                categoryBuffer = newCategory;
                currentCategoryList = newCategory.children;
            }

            for (let i = 1; i < categoryNames.length; i++) {
                const categoryName = categoryNames[i];
                let existingCategory = null;

                for (const category of currentCategoryList) {
                    if (category.name === categoryName) {
                        existingCategory = category;
                        break;
                    }
                }

                if (existingCategory) {
                    currentCategoryList = existingCategory.children;
                } else {
                    const newCategory = { name: categoryName, children: [] };
                    currentCategoryList.push(newCategory);
                    currentCategoryList = newCategory.children;
                }
            }

            await Category.findByIdAndUpdate(categoryBuffer._id.toString(), categoryBuffer);
        }

        await addOrUpdateCategory(req.body.categories);

        const allCollections = (await Collection.findOne({})) ?? new Collection({ collections: [] });

        for (const collection of req.body.collections) {
            const existingCollection = allCollections?.collections.find((col) => col === collection);

            if (!existingCollection) {
                allCollections.collections.push(collection);
            }
        }
        await allCollections.save();

        const minioClient = new Minio.Client({
            endPoint: "s3-service",
            port: 9000,
            useSSL: false,
            accessKey: "myminioaccesskey",
            secretKey: "myminiosecretkey",
        });

        const imgFullName = req.files.image.path.split("/")[2];
        const imgType = imgFullName.split(".")[1];
        const imgName = imgFullName.split(".")[0];

        const hash = new SHA3(512);
        const imgHashName = hash.update(imgName + Date.now()).digest("hex");

        const bucketName = "books-images";
        const imgFullHashName = imgHashName + "." + imgType;

        const book = new Book({
            name: req.body.name,
            author: req.body.author,
            coverType: req.body.coverType,
            publisher: req.body.publisher,
            size: req.body.size,
            ISBN: req.body.ISBN,
            pagesCount: req.body.pagesCount,
            ageLimit: req.body.ageLimit,
            year: req.body.year,
            circulation: req.body.circulation,
            annotation: req.body.annotation,
            price: req.body.price,
            image: imgFullHashName,
            weight: req.body.weight,
            series: req.body?.series,
            cycle: req.body?.cycle,
            categories: req.body.categories,
            collections: req.body.collections,
            stock: req.body.stock,
        });

        if (!(await minioClient.bucketExists(bucketName))) {
            minioClient.makeBucket(bucketName, "us-east-1", (err) => {
                if (err) throw new Error(err);
            });
        }

        await minioClient.putObject(bucketName, imgFullHashName, req.files.image);

        await book.save();
        await redisClient.del("categories");
        await redisClient.del("collections");

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/admin/updateBook", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasBookId = req.body?.bookId;
        if (!hasBookId) throw new Error("Пожалуйста, введите ID книги");

        await redisClient.del("book:" + req.body.bookId.toString());

        const validFields = [
            "name",
            "author",
            "stock",
            "coverType",
            "publisher",
            "series",
            "cycle",
            "size",
            "weight",
            "ISBN",
            "pagesCount",
            "ageLimit",
            "year",
            "circulation",
            "annotation",
            "discount",
            "price",
            "image",
            "categories",
            "collections",
        ];

        const update = {};
        for (const field in req.body) {
            if (field !== "bookId" && validFields.includes(field)) update[field] = req.body[field];
        }

        const hasChangeImageTo = req.files?.image !== undefined;
        if (hasChangeImageTo) {
            const book = await Book.findById(req.body.bookId);
            const minioClient = new Minio.Client({
                endPoint: "s3-service",
                port: 9000,
                useSSL: false,
                accessKey: "myminioaccesskey",
                secretKey: "myminiosecretkey",
            });

            const imgFullName = req.files.image.path.split("/")[2];
            const imgType = imgFullName.split(".")[1];
            const imgName = imgFullName.split(".")[0];

            const hash = new SHA3(512);
            const imgHashName = hash.update(imgName + Date.now()).digest("hex");

            const bucketName = "books-images";
            const imgFullHashName = imgHashName + "." + imgType;

            if (!(await minioClient.bucketExists(bucketName))) {
                minioClient.makeBucket(bucketName, "us-east-1", (err) => {
                    if (err) throw new Error(err);
                });
            }

            await minioClient.putObject(bucketName, imgFullHashName, req.files.image);

            if (book.image) {
                await minioClient.removeObject(bucketName, book.image);
            }

            update.image = imgFullHashName;
        }

        await Book.findByIdAndUpdate(req.body.bookId.toString(), update);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/admin/deleteBook", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasBookId = req.body?.bookId;
        if (!hasBookId) throw new Error("Пожалуйста, введите ID книги");

        const book = await Book.findById(req.body.bookId);

        const minioClient = new Minio.Client({
            endPoint: "s3-service",
            port: 9000,
            useSSL: false,
            accessKey: "myminioaccesskey",
            secretKey: "myminiosecretkey",
        });
        await minioClient.removeObject("books-images", book.image);

        await Book.findByIdAndDelete(req.body.bookId);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/searchBook", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const searchPhrase = decodeURIComponent(req.query?.search);
        const bookAvailability = decodeURIComponent(req.query?.available);
        const sortType = decodeURIComponent(req.query?.sort);
        const sortOrder = parseInt(decodeURIComponent(req.query?.order));

        let sort = "";
        if (sortType === "byNew") {
            if (sortOrder === 1) sort = { year: 1 };
            else if (sortOrder === -1) sort = { year: -1 };
            else throw new Error("Invalid sort order");
        } else if (sortType === "byPrice") {
            if (sortOrder === 1) sort = { price: 1 };
            else if (sortOrder === -1) sort = { price: -1 };
            else throw new Error("Invalid sort order");
        } else if (sortType === "byRating") {
            if (sortOrder === 1) sort = { rating: 1 };
            else if (sortOrder === -1) sort = { rating: -1 };
            else throw new Error("Invalid sort order");
        }

        const currentPage = parseInt(req.query.page) ?? 1;
        const stockOfBooksToSkip = (currentPage - 1) * 40;

        const regexPhrase = searchPhrase !== "undefined" ? RegExp(`^${searchPhrase}`, "i") : "";
        const bookAvailabilityCondition = bookAvailability === "true" ? { isAvailable: true } : {};

        const foundBooks = await Book.find({
            $or: [
                {
                    name: { $regex: regexPhrase },
                },
                {
                    author: { $regex: regexPhrase },
                },
                {
                    annotation: { $regex: regexPhrase },
                },
                {
                    publisher: { $regex: regexPhrase },
                },
                {
                    categories: { $regex: regexPhrase },
                },
                {
                    series: { $regex: regexPhrase },
                },
            ],
            ...bookAvailabilityCondition,
        })
            .skip(stockOfBooksToSkip)
            .limit(46)
            .sort(sort);

        const totalPages = Math.ceil(foundBooks.length / 40);
        if (currentPage > totalPages) throw new Error("Такой страницы не существует");

        res.status(200).send({ books: foundBooks, totalPages });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBooksByCategory", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const categoryPath = decodeURIComponent(req.query?.categoryPath);
        const sortType = decodeURIComponent(req.query?.sort);
        const sortOrder = parseInt(decodeURIComponent(req.query?.order));

        let sort = "";
        if (sortType === "byNew") {
            if (sortOrder === 1) sort = { year: 1 };
            else if (sortOrder === -1) sort = { year: -1 };
            else throw new Error("Неправильный порядок сортировки");
        } else if (sortType === "byPrice") {
            if (sortOrder === 1) sort = { price: 1 };
            else if (sortOrder === -1) sort = { price: -1 };
            else throw new Error("Неправильный порядок сортировки");
        } else if (sortType === "byRating") {
            if (sortOrder === 1) sort = { rating: 1 };
            else if (sortOrder === -1) sort = { rating: -1 };
            else throw new Error("Неправильный порядок сортировки");
        }

        const currentPage = parseInt(req.query.page) ?? 1;
        const stockOfBooksToSkip = (currentPage - 1) * 40;

        await redisClient.get("booksIn:" + categoryPath, async (err, reply) => {
            if (reply) {
                const totalPages = Math.ceil(JSON.parse(reply).length / 40);
                if (currentPage > totalPages) throw new Error("Такой страницы не существует");

                res.status(200).send({ books: JSON.parse(reply), totalPages });
            } else {
                const foundBooks = await Book.find({ categories: categoryPath }).skip(stockOfBooksToSkip).limit(46).sort(sort);

                await redisClient.set("booksIn:" + categoryPath, JSON.stringify(foundBooks), "EX", 60 * 60);

                const totalPages = Math.ceil(foundBooks.length / 40);
                if (currentPage > totalPages) throw new Error("Такой страницы не существует");

                res.status(200).send({ books: foundBooks, totalPages });
            }
        });

        const totalPages = Math.ceil(foundBooks.length / 40);
        if (currentPage > totalPages) throw new Error("Такой страницы не существует");

        res.status(200).send({ books: foundBooks, totalPages });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getAllCategories", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const cachedCategories = await redisClient.get("categories");
        if (cachedCategories) {
            res.status(200).send(JSON.parse(cachedCategories));
        } else {
            const categories = await Category.find();
            await redisClient.set("categories", JSON.stringify(categories), "EX", 60 * 60 * 24);
            res.status(200).send(categories);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getAllCollections", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);
        await redisClient.del("collections");

        const cachedCollections = await redisClient.get("collections");
        if (cachedCollections) {
            res.status(200).send(JSON.parse(cachedCollections));
        } else {
            const collections = await Collection.findOne();
            await redisClient.set("collections", JSON.stringify(collections.collections), "EX", 60 * 60 * 24);
            res.status(200).send(collections);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBooksByCollection", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const collectionName = decodeURIComponent(req.query?.collectionName);
        const sortType = decodeURIComponent(req.query?.sort);
        const sortOrder = parseInt(decodeURIComponent(req.query?.order));

        let sort = "";
        if (sortType === "byNew") {
            if (sortOrder === 1) sort = { year: 1 };
            else if (sortOrder === -1) sort = { year: -1 };
            else throw new Error("Неправильный порядок сортировки");
        }
        if (sortType === "byPrice") {
            if (sortOrder === 1) sort = { price: 1 };
            else if (sortOrder === -1) sort = { price: -1 };
            else throw new Error("Неправильный порядок сортировки");
        }
        if (sortType === "byRating") {
            if (sortOrder === 1) sort = { rating: 1 };
            else if (sortOrder === -1) sort = { rating: -1 };
            else throw new Error("Неправильный порядок сортировки");
        }

        const currentPage = parseInt(req.query.page) ?? 1;
        const stockOfBooksToSkip = (currentPage - 1) * 46;

        const foundBooks = await Book.find({ collections: collectionName }).skip(stockOfBooksToSkip).limit(46).sort(sort);

        const totalPages = Math.ceil(foundBooks.length / 46);
        if (currentPage > totalPages) throw new Error("Такой страницы не существует");

        res.status(200).send({ books: foundBooks, totalPages });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBooksBarByCollection", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const collection = decodeURIComponent(req.query?.collection);

        const foundBooks = await Book.find({ collections: { $in: [collection] } }).limit(16);

        res.status(200).send(foundBooks);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBookData", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const cachedBook = await redisClient.get("book:" + req.query?.bookId.toString());
        if (cachedBook) {
            res.status(200).send(JSON.parse(cachedBook));
        } else {
            const bookId = req.query?.bookId;
            if (!bookId) throw new Error("Пожалуйста, введите ID книги");

            const book = await Book.findById(bookId);

            await redisClient.set("book:" + bookId.toString(), JSON.stringify(book), "EX", 60 * 60 * 24);

            res.status(200).send(book);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBookImage", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const parsedURL = url.parse(req.url, true);
        const imgName = parsedURL.query.imgName;
        const imageBucketName = "books-images";

        const minioClient = new Minio.Client({
            endPoint: "s3-service",
            port: 9000,
            useSSL: false,
            accessKey: "myminioaccesskey",
            secretKey: "myminiosecretkey",
        });

        const imageStream = await minioClient.getObject(imageBucketName, imgName);
        res.set({ "Content-Type": "image" });

        imageStream.pipe(res);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/getShoppingCartBooks", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const bookIds = req.body?.bookIds;

        const foundBooks = await Book.find({ _id: { $in: bookIds } });

        res.status(200).send(foundBooks);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/getWishlistBooks", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const bookIds = req.body?.bookIds;

        const foundBooks = await Book.find({ _id: { $in: bookIds } });

        res.status(200).send(foundBooks);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
})

module.exports = router;
