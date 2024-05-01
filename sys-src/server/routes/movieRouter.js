const router = require('express').Router();
const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Movie = require('../models/movieModel');
const multer = require('multer');
const imageId = require('../middleware/imageId');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        cb(null, req.imageId + '.' + extension);
    },
});

const upload = multer({ storage: storage });

router.post(
    '/add-movie',
    auth,
    imageId,
    upload.single('file'),
    async (req, res) => {
        try {
            // Check if Admin:
            const isAdmin = await User.findById(req.user);
            if (!isAdmin) {
                return res.status(401).json({
                    errors: [{ param: 'notAdmin', message: 'not allowed' }],
                });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({
                        errors: [
                            {
                                param: 'validationResultFail',
                                message: 'validationResult failed',
                            },
                        ],
                    });
            }

            const formData = req.body;

            // check if image is present:
            var imgName;
            if (req.file !== undefined) {
                imgName = '/' + req.file.filename;
            } else {
                imgName = '';
            }

            // create new movie with data from formData
            const newMovie = new Movie({
                _id: req.imageId,
                title: formData['title'],
                description: formData['description'],
                release: formData['releaseDate'],
                trailer: formData['trailer'],
                image: `${imgName}`,
            });

            //
            await newMovie.save();
            return res.json({ status: true });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: false,
                errors: [{ param: 'internal', message: e.message }],
            });
        }
    }
);

router.get('/get-movie/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const movieDb = await Movie.findById(_id);
        if (!movieDb)
            return res.status(400).json({
                status: false,
                errors: [{ param: 'movie', message: 'no movie found' }],
            });
        return res.json(movieDb);
    } catch (e) {
        return res.status(500).json({
            status: false,
            errors: [{ param: 'internal', message: e.message }],
        });
    }
});

router.get('/get-all-movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        return res.json({ movies });
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ param: 'internal', message: e.message }] });
    }
});

module.exports = router;
