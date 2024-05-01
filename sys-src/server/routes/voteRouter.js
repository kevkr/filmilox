const {body, validationResult} = require("express-validator");
const router = require('express').Router();
const Vote = require('../models/voteModel');
const auth = require("../middleware/auth");
const Review = require("../models/reviewModel");

router.post(
    '/submitVote',
    auth,
    body('reviewId').exists().isString(),
    body('isUpvote').exists().isBoolean(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {reviewId, isUpvote} = req.body;
            const userId = req.user;

            //Make sure the Review specified actually exists
            const existingReview = await Review.findById(reviewId);
            if (!existingReview)
                return res.status(404).json({
                    errors: [{message: "The review you're trying to rate doesn't exist."}],
                });

            const existingVote = await Vote.findOne({
                user: userId,
                review: reviewId,
            });
            if (existingVote) {
                Vote.updateOne({user: userId, review: reviewId}, {state: isUpvote}, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.status(200).json({
                        message: 'Vote updated successfully.',
                    });
                })

            } else {
                const newVote = new Vote({
                    user: userId,
                    review: reviewId,
                    state: isUpvote,
                });
                await newVote.save();

                return res.status(200).json({
                    message: 'Vote added successfully.',
                });
            }
        } catch (e) {
            return res
                .status(500)
                .json({errors: [{message: e.message}]});
        }

    }
);

router.get(
    '/:reviewId',
    async (req, res) => {
        try {
            const {reviewId} = req.params;
            const existingReview = await Review.findById(reviewId);
            if (!existingReview)
                return res.status(404).json({
                    errors: [{message: "The review doesn't exist."}],
                });
            const upvotes = await Vote.find({review: reviewId, state: true}).count();
            const downvotes = await Vote.find({review: reviewId, state: false}).count();

            return res.json({upvote: upvotes, downvote: downvotes});
        } catch (e) {
            return res
                .status(500)
                .json({errors: [{message: e.message}]});
        }
    }
)

router.get('/existingVote/:reviewId/', auth, async (req, res) => {
    try {
        const {reviewId} = req.params;
        Vote.findOne({user: req.user, review: reviewId}, (err, vote) => {
            if (err) {
                console.log(err);
            }
            if (!vote) {
                return res.json({userVote: undefined});
            }
            return res.json({
                userVote: vote.state
            });
        })
    } catch (e) {
        return res
            .status(500)
            .json({errors: [{message: e.message}]});
    }

})
module.exports = router;