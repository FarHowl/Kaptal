const express = require("express");
const router = express.Router();

const verifyJWT = require("./utils/verifyJWT");

const { Book, Category, Collection } = require("./models");

router.get("/admin/getAllBooks", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const totalAmountOfBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalAmountOfBooks / 1);
        const currentPage = parseInt(req.query.page);
        if (currentPage > totalPages) throw new Error("Undefined page");

        const amountOfBooksToSkip = (currentPage - 1) * 1;
        const foundBooks = await Book.find().skip(amountOfBooksToSkip).limit(1);

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
            req.body?.image ||
            req.body?.weight ||
            req.body?.series ||
            req.body?.amount ||
            req.body?.categoryPath ||
            req.body?.collections ||
            req.body?.language;
        if (!hasAllFields) throw new Error("Enter all fields");

        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(req.body.image)) throw new Error("Invalid image URL");

        // const imgOriginalName = req.files.image.originalFilename;
        // let imgParsedName;
        // let imgType;

        // if (imgOriginalName.split(".").length === 2 && (imgOriginalName.split(".")[1] === "jpg" || imgOriginalName.split(".")[1] === "jpeg")) {
        //     imgParsedName = imgOriginalName.split(".")[0];
        //     imgType = imgOriginalName.split(".")[1];
        // } else throw new Error();

        // const hash = new SHA3(512);
        // const imgHash = hash.update(imgParsedName + Date.now()).digest("hex");

        // const imgDestPath = "../src/images/booksImages/" + stringHash + "." + imgType;

        async function addOrUpdateCategory(categoryNames) {
            const allCategories = await Category.find();
            let currentCategoryList = allCategories;
            let upperCategoryExists = false;
            let categoryBuffer;

            for (const category of allCategories) {
                if (category.name === categoryNames[0]) {
                    upperCategoryExists = true;
                    categoryBuffer = category;
                    currentCategoryList = categoryBuffer.children;
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

        const categoryNames = req.body.categoryPath.split("/");
        addOrUpdateCategory(categoryNames);

        const collectionsArray = [];
        for (const collection of req.body.collections) {
            const existingCollection = await Collection.findOne({ name: collection });
            collectionsArray.push(existingCollection);

            if (!existingCollection) {
                const newCollection = new Collection({ name: collection });
                await newCollection.save();
                collectionsArray.push(newCollection);
            }
        }

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
            image: req.body.image,
            weight: req.body.weight,
            series: req.body.series,
            language: req.body.language,
            category: categoryNames[categoryNames.length - 1],
            collections: collectionsArray,
            amount: req.body.amount,
        });

        await book.save();
        // fs.copyFileSync(req.files.image.path, imgDestPath);
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
        if (!hasBookId) throw new Error("Please, enter userId");

        const book = await Book.findById(req.body.bookId);

        const update = {};

        const hasChangeNameTo = req.body?.name !== undefined;
        if (hasChangeNameTo) update.name = req.body.name;

        const hasChangeAuthorTo = req.body?.author !== undefined;
        if (hasChangeAuthorTo) update.author = req.body.author;

        const hasChangeGenresTo = req.body?.genres !== undefined;
        if (hasChangeGenresTo) update.genres = req.body.genres;

        const hasChangeIsAvailableTo = req.body?.isAvailable !== undefined;
        if (hasChangeIsAvailableTo) update.isAvailable = req.body.isAvailable;

        const hasChangePublisherTo = req.body?.publisher !== undefined;
        if (hasChangePublisherTo) update.publisher = req.body.publisher;

        const hasChangeCoverTypeTo = req.body?.coverType !== undefined;
        if (hasChangeCoverTypeTo) update.coverType = req.body.coverType;

        const hasChangeSizeTo = req.body?.size !== undefined;
        if (hasChangeSizeTo) update.size = req.body.size;

        const hasChangeISBNTo = req.body?.ISBN !== undefined;
        if (hasChangeISBNTo) update.ISBN = req.body.ISBN;

        const hasChangePagesCountTo = req.body?.pagesCount !== undefined;
        if (hasChangePagesCountTo) update.pagesCount = req.body.pagesCount;

        const hasChangeAgeLimitTo = req.body?.ageLimit !== undefined;
        if (hasChangeAgeLimitTo) update.ageLimit = req.body.ageLimit;

        const hasChangeYearTo = req.body?.year !== undefined;
        if (hasChangeYearTo) update.year = req.body.year;

        const hasChangeCirculationTo = req.body?.circulation !== undefined;
        if (hasChangeCirculationTo) update.circulation = req.body.circulation;

        const hasChangeAnnotationTo = req.body?.annotation !== undefined;
        if (hasChangeAnnotationTo) update.annotation = req.body.annotation;

        const hasChangeDiscountTo = req.body?.discount !== undefined;
        if (hasChangeDiscountTo) update.discount = req.body.discount;

        const hasChangeLanguageTo = req.body?.language !== undefined;
        if (hasChangeLanguageTo) update.language = req.body.language;

        const hasChangeSeriesTo = req.body?.series !== undefined;
        if (hasChangeSeriesTo) update.series = req.body.series;

        const hasChangeWeightTo = req.body?.weight !== undefined;
        if (hasChangeWeightTo) update.weight = req.body.weight;

        const hasChangeRatingCountTo = req.body?.ratingCount !== undefined;
        if (hasChangeRatingCountTo) update.ratingCount = req.body.ratingCount;

        const hasChangeImageTo = req.body?.image !== undefined;
        if (hasChangeImageTo) update.image = req.body.image;

        // const hasChangeImageTo = req.files?.image !== undefined;
        // if (hasChangeImageTo) {
        //     const book = await Book.findById(req.body.bookId);
        //     fs.unlink("../src/images/booksImages/" + book.image, (err) => {
        //         if (err) throw new Error();
        //     });

        //     const imgOriginalName = req.files.image.originalFilename;
        //     let imgParsedName;
        //     let imgType;

        //     if (imgOriginalName.split(".").length === 2 && (imgOriginalName.split(".")[1] === "jpg" || imgOriginalName.split(".")[1] === "jpeg")) {
        //         imgParsedName = imgOriginalName.split(".")[0];
        //         imgType = imgOriginalName.split(".")[1];
        //     } else throw new Error();

        //     const imgHash = new SHA3(512);

        //     imgHash.update(imgParsedName + Date.now());
        //     const stringHash = imgHash.digest("hex");

        //     const imgDestPath = "../src/images/booksImages/" + stringHash + "." + imgType;
        //     fs.copyFileSync(req.files.image.path, imgDestPath);

        //     update.image = stringHash + "." + imgType;
        // }

        await Book.findByIdAndUpdate(book._id.toString(), update);

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
        if (!hasBookId) throw new Error("Please, enter book id");

        const book = await Book.findById(req.body.bookId);
        // fs.unlink("../src/images/booksImages/" + book.image, (err) => {
        //     if (err) throw new Error();
        // });

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
        const amountOfBooksToSkip = (currentPage - 1) * 46;

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
                    category: { $regex: regexPhrase },
                },
                {
                    series: { $regex: regexPhrase },
                },
            ],
            ...bookAvailabilityCondition,
        })
            .skip(amountOfBooksToSkip)
            .limit(46)
            .sort(sort);

        const totalPages = Math.ceil(foundBooks.length / 46);
        if (currentPage > totalPages) throw new Error("Undefined page");

        res.status(200).send({ books: foundBooks, totalPages });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBookData", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const bookId = req.query?.bookId;
        if (!bookId) throw new Error("Please, enter book id");

        const book = await Book.findById(bookId);
        res.status(200).send({ book });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getAllCategories", async (req, res) => {
    try {
        const categories = await Category.find().populate("parent");

        res.status(200).send({ categories });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

// router.get("/book/getBookImage", async (req, res) => {
//     try {
//         verifyJWT(req);

//         const parsedURL = url.parse(req.url, true);
//         const imgName = parsedURL.query.imgName;

//         res.set({ "Content-Type": "image/png" });
//         res.sendFile("C:/Users/dima3/OneDrive/Документы/GitHub/KaptalServer/src/images/booksImages/" + imgName);
//     } catch (error) {
//         console.log(error);
//         res.send(500, { error: error.message });
//     }
// });

module.exports = router;
