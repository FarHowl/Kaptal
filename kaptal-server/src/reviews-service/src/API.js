const express = require("express");
const router = express.Router();

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://reviews-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

const verifyJWT = require("./utils/verifyJWT");

const { Review, Rating } = require("./models");

router.get("/user/getBookReviews", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const bookId = req.query?.bookId;

        const reviews = await Review.find({ status: "checked", _id: bookId });

        res.status(200).send(reviews);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/user/getBookRating", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const bookId = req.query?.bookId;

        const bookRatings = await Rating.findById(bookId);

        res.status(200).send(bookRatings);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/addReview", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.text && req.body?.title && req.body?.bookRating && req.body?.author && req.body?.bookId;
        if (!hasAllFields) throw new Error("Please enter all fields");

        if (req.body?.rating < 1 || req.body?.rating > 5) throw new Error("Rating must be between 1 and 5");

        if (req.body?.text.length < 10) throw new Error("Review text must be at least 10 characters long");

        if (req.body?.title.length < 5) throw new Error("Review title must be at least 5 characters long");

        if (req.body?.pros.length < 4) throw new Error("Review pros must be at least 5 characters long");

        if (req.body?.cons.length < 4) throw new Error("Review cons must be at least 5 characters long");

        if (req.body?.author.length < 4) throw new Error("Author name must be at least 4 characters long");

        const publicationDate = new Date();
        const day = publicationDate.getDate();
        const month = publicationDate.getMonth() + 1;
        const year = publicationDate.getFullYear();
        publicationDate = day + "." + month + "." + year;

        const review = new Review({
            text: req.body?.text,
            title: req.body?.title,
            bookRating: req.body?.bookRating,
            author: req.body?.author,
            publicationDate: publicationDate,
            bookId: req.body?.bookId,
            pros: req.body?.pros,
            cons: req.body?.cons,
        });

        await review.save();
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/rateReview", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.reviewId && req.body?.isReviewUseful && req.body?.userId;
        if (!hasAllFields) throw new Error("Please enter all fields");

        const review = await Review.findById(req.body?.reviewId);
        if (!review) throw new Error("Review not found");

        const userAlreadyRated = review.ratings.find((i) => i.userId === req.body.userId);
        if (userAlreadyRated) throw new Error("You already rated this review");

        review.ratings.push({ userId: req.user.id, isReviewUseful: req.body?.isReviewUseful });
        await review.save();

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/addRating", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId && req.body?.bookRating && req.body?.userId;
        if (!hasAllFields) throw new Error("Please, enter book id and rating");

        const rating = new Rating({ bookId: req.body?.bookId, bookRating: req.body?.bookRating, userId: req.body?.userId });

        await rating.save();
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.get("/moderator/getUncheckedReviews", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const uncheckedReviews = Review.find({ status: "unchecked" });

        res.status(200).send(uncheckedReviews);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/moderator/checkReview", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.status && req.body?.reviewId;
        if (!hasAllFields) throw new Error("Please, enter all fields");
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

module.exports = router;
