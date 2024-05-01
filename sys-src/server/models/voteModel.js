const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            required: true,
        },
        // True  -> Upvote
        // False -> Downvote
        state: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
