const express = require("express");
const router = express.Router();

const verifyJWT = require("./utils/verifyJWT");

const { Review } = require("./models");

router.get("/user/getBookReviews", async (req, res) => {
    try {
        const hasToBeAuthorized = false;
        verifyJWT(req, hasToBeAuthorized);

        const bookId = req.query?.bookId;

        const reviews = await Review.findById(bookId);

        res.status(200).send(reviews);
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
});

router.post("/user/addReview", async (req, res) => {
    try {
        const hasToBeAuthorized = true;
        verifyJWT(req, hasToBeAuthorized);

        const hasAllFields = req.body?.text && req.body?.title && req.body?.bookRating && req.body?.author && req.body?.publicationDate && req.body?.bookId;
        if (!hasAllFields) throw new Error("Please enter all fields");

        if (req.body?.rating < 1 || req.body?.rating > 5) throw new Error("Rating must be between 1 and 5");

        if (req.body?.text.length < 10) throw new Error("Review text must be at least 10 characters long");

        if (req.body?.title.length < 5) throw new Error("Review title must be at least 5 characters long");

        if (req.body?.pros.length < 4) throw new Error("Review pros must be at least 5 characters long");

        if (req.body?.cons.length < 4) throw new Error("Review cons must be at least 5 characters long");

        if (req.body?.author.length < 4) throw new Error("Author name must be at least 4 characters long");

        const publicationDate = new Date(req.body?.publicationDate);
        if (publicationDate > new Date()) throw new Error("Publication date must be in the past");

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(req.body?.publicationDate)) throw new Error("Invalid date format");

        const review = new Review({
            text: req.body?.text,
            title: req.body?.title,
            bookRating: req.body?.bookRating,
            author: req.body?.author,
            publicationDate: req.body?.publicationDate,
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

module.exports = router;
