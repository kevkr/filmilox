const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('username').isLength({ min: 1 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password, username } = req.body;

            // Search for existing User with same email
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser)
                return res.status(404).json({
                    errors: [
                        {
                            param: 'email',
                            message:
                                "You can't create a new account with this email",
                        },
                    ],
                });

            // Search for existing User with same username
            const existingUsernameUser = await User.findOne({ username });
            if (existingUsernameUser)
                return res.status(404).json({
                    errors: [
                        {
                            param: 'username',
                            message:
                                "You can't create a new account with this username",
                        },
                    ],
                });

            // Hash Password
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            // Create new User
            const newUser = new User({
                email,
                username,
                password: passwordHash,
            });
            await newUser.save();
            return res.json({ status: true });
        } catch (e) {
            return res
                .status(500)
                .json({ errors: [{ pram: 'internal', message: e.message }] });
        }
    }
);
router.post(
    '/login',
    body('identifier').isLength({ min: 1 }),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { identifier, password } = req.body;

            let userDb;
            const emailIdentifierUser = await User.findOne({
                email: identifier,
            });
            if (emailIdentifierUser) userDb = emailIdentifierUser;

            const usernameIdentifierUser = await User.findOne({
                username: identifier,
            });
            if (usernameIdentifierUser) userDb = usernameIdentifierUser;

            if (!userDb)
                return res.status(400).json({
                    errors: [
                        {
                            param: 'identifier',
                            message:
                                'No user found with this username or email',
                        },
                    ],
                });

            // check if password match
            const isMatchUser = await bcrypt.compare(password, userDb.password);

            if (!isMatchUser) {
                return res.status(400).json({
                    errors: [
                        { param: 'password', message: 'Password incorrect' },
                    ],
                });
            }

            const token = jwt.sign({ id: userDb._id }, process.env.JWT_SECRET);
            return res.json({ token });
        } catch (e) {
            return res
                .status(500)
                .json({ errors: [{ param: 'internal', message: e.message }] });
        }
    }
);

router.post('/fetch-data', auth, async (req, res) => {
    try {
        const userDb = await User.findById(req.user).select(
            'username email admin profile'
        );
        if (!userDb)
            return res.status(400).json({
                errors: [{ param: 'user', message: 'No user found' }],
            });
        return res.json(userDb);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ param: 'internal', message: e.message }] });
    }
});

router.get('/getusername/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('username');
        if (!user) {
            return res
                .status(400)
                .json({ error: { message: 'No user found' } });
        }
        return res.json(user);
    } catch (e) {
        return res
            .status(500)
            .json({ errors: [{ param: 'internal', message: e.message }] });
    }
});

module.exports = router;
