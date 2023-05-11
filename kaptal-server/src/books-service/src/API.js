const express = require("express");
const router = express.Router();

const verifyJWT = require("./utils/verifyJWT");
const jwt = require("jsonwebtoken");

const { SHA3 } = require("sha3");

const fs = require("fs");
const { Book } = require("./models");

router.get("/admin/getAllBooks", async (req, res) => {
    try {
        verifyJWT(req);

        const books = await Book.find({});
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/admin/addNewBook", async (req, res) => {
    try {
        verifyJWT(req);

        const hasAllFields =
            req.body?.name ||
            req.body?.author ||
            req.body?.genres ||
            req.body?.isAvailable ||
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
            req.body?.series ||
            req.body?.ratingCount ||
            req.body?.language;
        if (!hasAllFields) throw new Error("Enter all fields");

        const imgOriginalName = req.files.image.originalFilename;
        let imgParsedName;
        let imgType;

        if (imgOriginalName.split(".").length === 2 && (imgOriginalName.split(".")[1] === "jpg" || imgOriginalName.split(".")[1] === "jpeg")) {
            imgParsedName = imgOriginalName.split(".")[0];
            imgType = imgOriginalName.split(".")[1];
        } else throw new Error();

        const hash = new SHA3(512);
        const imgHash = hash.update(imgParsedName + Date.now()).digest("hex");

        const imgDestPath = "../src/images/booksImages/" + stringHash + "." + imgType;

        const book = new Book({
            name: req.body.name,
            author: req.body.author,
            genres: req.body.genres,
            isAvailable: req.body.isAvailable,
            coverType: req.body.coverType,
            publisher: req.body.publisher,
            size: req.body.size,
            ISBN: req.body.ISBN,
            pagesCount: req.body.pagesCount,
            ageLimit: req.body.ageLimit,
            year: req.body.year,
            circulation: req.body.circulation,
            annotation: req.body.annotation,
            discount: req.body.discount,
            price: req.body.price,
            image: imgHash + "." + imgType,
            weight: req.body.weight,
            series: req.body.series,
            ratingCount: req.body.ratingCount,
            language: req.body.language,
        });

        await book.save();
        fs.copyFileSync(req.files.image.path, imgDestPath);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/admin/updateBook", async (req, res) => {
    try {
        verifyJWT(req);

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

        const hasChangeImageTo = req.files?.image !== undefined;
        if (hasChangeImageTo) {
            const book = await Book.findById(req.body.bookId);
            fs.unlink("../src/images/booksImages/" + book.image, (err) => {
                if (err) throw new Error();
            });

            const imgOriginalName = req.files.image.originalFilename;
            let imgParsedName;
            let imgType;

            if (imgOriginalName.split(".").length === 2 && (imgOriginalName.split(".")[1] === "jpg" || imgOriginalName.split(".")[1] === "jpeg")) {
                imgParsedName = imgOriginalName.split(".")[0];
                imgType = imgOriginalName.split(".")[1];
            } else throw new Error();

            const imgHash = new SHA3(512);

            imgHash.update(imgParsedName + Date.now());
            const stringHash = imgHash.digest("hex");

            const imgDestPath = "../src/images/booksImages/" + stringHash + "." + imgType;
            fs.copyFileSync(req.files.image.path, imgDestPath);

            update.image = stringHash + "." + imgType;
        }

        await Book.findByIdAndUpdate(book._id.toString(), update);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/admin/deleteBook", async (req, res) => {
    try {
        verifyJWT(req);

        const hasBookId = req.body?.bookId;
        if (!hasBookId) throw new Error();

        const book = await Book.findById(req.body.bookId);
        fs.unlink("../src/images/booksImages/" + book.image, (err) => {
            if (err) throw new Error();
        });

        await Book.findByIdAndDelete(req.body.bookId);

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get("/book/getBookImage", async (req, res) => {
    try {
        verifyJWT(req);

        const parsedURL = url.parse(req.url, true);
        const imgName = parsedURL.query.imgName;

        res.set({ "Content-Type": "image/png" });
        res.sendFile("C:/Users/dima3/OneDrive/Документы/GitHub/KaptalServer/src/images/booksImages/" + imgName);
    } catch (error) {
        console.log(error);
        res.send(500, { error: error.message });
    }
});

module.exports = router;
