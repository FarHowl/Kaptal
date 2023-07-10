const express = require("express");
const router = express.Router();


const verifyJWT = require("./utils/verifyJWT");

const { Review } = require("./models");

const redis = require("redis");
const redisClient = redis.createClient({ url: "redis://reviews-redis:6379" });

redisClient.on("error", (error) => {
    console.log("Redis Client Error", error);
});

redisClient.connect();

router.get("/user/getBookReviews", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const bookId = req.query?.bookId;

        const reviews = await Review.find({ status: "checked", bookId: bookId });

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

        const bookRatings = await Review.find({ bookId, text: { $exists: false } });

        res.status(200).send(bookRatings);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/addReview", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.text && req.body?.title && req.body?.bookRating && req.body?.author && req.body?.bookId;
        if (!hasAllFields) throw new Error("Please enter all fields");

        const bookReviews = await Review.find({ bookId: req.body?.bookId });
        for (const review of bookReviews) {
            if (review.userId === frontendToken.userId) throw new Error("You already reviewed this book");
        }

        if (req.body?.rating < 1 || req.body?.rating > 5) throw new Error("Rating must be between 1 and 5");

        if (req.body?.text.length < 10) throw new Error("Review text must be at least 10 characters long");

        if (req.body?.title.length < 5) throw new Error("Review title must be at least 5 characters long");

        if (req.body?.pros?.length < 4) throw new Error("Review pros must be at least 5 characters long");

        if (req.body?.cons?.length < 4) throw new Error("Review cons must be at least 5 characters long");

        if (req.body?.author.length < 4) throw new Error("Author name must be at least 4 characters long");

        let publicationDate = new Date();
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
            userId: frontendToken.userId,
            status: "unchecked",
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
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.reviewId && req.body?.isReviewUseful !== undefined;
        if (!hasAllFields) throw new Error("Please enter all fields");

        const review = await Review.findById(req.body?.reviewId);
        if (!review) throw new Error("Review not found");

        const isSelfRate = review.userId.toString() === frontendToken.userId;
        if (isSelfRate) {
            throw new Error("You can't rate your own review");
        }

        const userRating = review.reviewRating?.find((i) => i.userId.toString() === frontendToken.userId);
        if (userRating) {
            if (userRating.isReviewUseful === req.body?.isReviewUseful) {
                throw new Error("You already rated this review");
            } else {
                await Review.updateOne({ _id: req.body?.reviewId, "reviewRating.userId": frontendToken.userId }, { $set: { "reviewRating.$.isReviewUseful": req.body?.isReviewUseful } });
            }
        } else {
            await Review.updateOne({ _id: req.body?.reviewId }, { $push: { reviewRating: { userId: frontendToken.userId, isReviewUseful: req.body?.isReviewUseful } } });
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/addRating", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        const frontendToken = verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId && req.body?.bookRating;
        if (!hasAllFields) throw new Error("Please, enter book id and rating");

        const bookRatings = await Review.find({ bookId: req.body?.bookId });
        for (const rating of bookRatings) {
            if (rating.userId === frontendToken.userId) throw new Error("You already rated this book");
        }

        const rating = new Review({ bookId: req.body?.bookId, bookRating: req.body?.bookRating, userId: frontendToken.userId, reviewRating: undefined });

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

        const uncheckedReviews = await Review.find({ status: "unchecked" });

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

        if (req.body?.status === "checked") {
            const review = await Review.findByIdAndUpdate(req.body?.reviewId, { status: req.body?.status });
        } else if (req.body?.status === "unchecked") {
            const review = await Review.findByIdAndDelete(req.body?.reviewId);
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/admin/deleteBookReviews", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.bookId;
        if (!hasAllFields) throw new Error("Please, enter all fields");

        const reviews = await Review.deleteMany({ bookId: req.body?.bookId });

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

module.exports = router;
