const router = require('express').Router();
const User = require('../models/userModel');
const multer = require('multer');
const imageId = require('../middleware/imageId');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

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
    '/usersettings',
    auth,
    imageId,
    upload.single('file'),
    async (req, res) => {
        try {
            /*Find the logged in User*/
            const user = await User.findById(req.user);
            /*No User found*/
            if (!user) {
                return res.status(400).json({
                    errors: [{ param: 'no user', message: 'Not allowed!' }],
                });
            }
            /*Find Image and Path*/
            if (user.profile) {
                const imagePath = path.join(
                    __dirname,
                    '../',
                    'public',
                    user.profile
                );
                fs.unlink(imagePath, (err) => {
                    if (err) {
                    }
                });
            }
            let imgName;
            if (req.file !== undefined) {
                imgName = req.file.filename;
            } else {
                imgName = '';
            }
            /*Update User Profile column with Link to image*/
            await User.findByIdAndUpdate(req.user, {
                profile: `/${imgName}`,
            });
            const userDb = await User.findById(req.user);
            return res.json(userDb);
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({ errors: [{ param: 'internal', message: e.message }] });
        }
    }
);

module.exports = router;
