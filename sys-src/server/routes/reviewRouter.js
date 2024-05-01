const { body, validationResult } = require('express-validator');
const router = require('express').Router();
const Review = require('../models/reviewModel');
const auth = require('../middleware/auth');

/**
 * Recalculate the rating of a movie by taking the average of all the ratings of the reviews that are
 * associated with that movie.
 *
 * @param movie - The movie object that we want to recalculate the rating for.
 */
const recalculateMovieRating = async (movie) => {
    const reviews = await Review.find({ movie: movie._id });
    if (reviews.length === 0) {
        movie.rating = 0;
        await movie.save();
        return;
    }
    const newMovieRating =
        reviews.reduce((sumRating, curReview) => {
            return sumRating + curReview.rating;
        }, 0) / reviews.length;

    movie.rating = newMovieRating;
    await movie.save();
};

router.post(
    '/addreview',
    auth,
    body('movieId').exists().isString(),
    body('rating').exists().isInt({ min: 1, max: 10 }),
    body('comment').exists().isString().isLength({ max: 2000 }),
    async (req, res) => {
        const errors = validationResult(req);

        //return when there is an error
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { movieId, rating, comment } = req.body;

        //check if movie exists
        const existingMovie = await Movie.findById(movieId);
        if (!existingMovie)
            return res.status(404).json({
                errors: [
                    {
                        message: "The movie doesn't exist.",
                    },
                ],
            });

        //check if the user has a review to the movie
        const existingReview = await Review.findOne({
            user: req.user,
            movie: movieId,
        });
        if (existingReview)
            return res.status(404).json({
                errors: [
                    {
                        message: 'You can only add one review per movie.',
                    },
                ],
            });

        try {
            //create a new Review and save it
            const newReview = new Review({
                user: req.user,
                movie: movieId,
                rating,
                comment,
            });
            await newReview.save();
            await recalculateMovieRating(existingMovie);
            const review = await Review.findById(newReview._id)
                .populate({ path: 'user', select: 'username' })
                .populate({ path: 'movie' })
                .exec();

            return res.json(review);
        } catch (e) {
            return res.status(500).json({ error: { message: 'Failed' } });
        }
    }
);

router.get('/getreview/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const reviews = await Review.find({ movie: movieId })
            .populate({ path: 'user', select: 'username' })
            .exec();
        if (!reviews) {
            return res
                .status(400)
                .json({ error: { message: 'No reviews found' } });
        }
        return res.json(reviews);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ param: 'internal', message: e.message }] });
    }
});

router.post('/deleteReview', auth, async (req, res) => {
    try {
        const userDb = await User.findById(req.user);
        if (!userDb)
            return res.status(400).json({
                errors: [{ param: 'user', message: 'No user found.' }],
            });
        const { reviewId } = req.body;
        const reviewDb = await Review.findById(reviewId);
        if (!reviewDb)
            return res.status(400).json({
                errors: [{ param: 'movie', message: 'No moview found.' }],
            });
        const adminDb = await User.findOne({ admin: true });
        if (!reviewDb.user.equals(req.user) && !adminDb) {
            return res.status(400).json({
                errors: [{ param: 'auth', message: 'You are not allowed.' }],
            });
        }
        await Review.findByIdAndDelete(reviewId);
        const movieDb = await Movie.findById(reviewDb.movie);
        await recalculateMovieRating(movieDb);
        const updatedMoviewDb = await Movie.findById(reviewDb.movie);
        return res.json(updatedMoviewDb);
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ errors: [{ param: 'internal', message: e.message }] });
    }
});

module.exports = router;
