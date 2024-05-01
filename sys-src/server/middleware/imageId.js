const { request } = require('express');
const { default: mongoose } = require('mongoose');

const imageId = async (req, res, next) => {
    try {
        const imageId = new mongoose.Types.ObjectId();
        request.imageId = imageId;

        next();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = imageId;
