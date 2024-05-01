const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Controller = require('../controller/Controller');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

let mockDb;

const connect = async () => {
    mockDb = await MongoMemoryServer.create();
    const mockDbUri = await mockDb.getUri();
    const mongooseOpts = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(mockDbUri, mongooseOpts);
};

const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mockDb.stop();
};

const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
};

const addTestMoviesToDatabase = async () => {
    await Controller.addTestMovies();
    const movie = new Movie({
        _id: '507f1f77bcf86cd799439010',
        title: 'Test movie',
        description: 'Description of the test movie.',
        release: new Date('1/1/2001'),
        trailer: 'youtube link',
        image: 'image id',
        rating: 0,
    });
    await movie.save();

    const movie1 = new Movie({
        _id: '507f1f77bcf86cd799439020',
        title: 'Test movie',
        description: 'Description of the test movie.',
        release: new Date('1/1/2001'),
        trailer: 'youtube link',
        image: 'image id',
        rating: 0,
    });
    await movie1.save();
};

const addTestReviewToDatabase = async () => {
    const review = new Review({
        movie: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439012',
        rating: 5,
        comment: 'I am a test, I test things',
    });
    await review.save();
    const review1 = new Review({
        _id: '507f1f77bcf86cd799439040',
        movie: '507f1f77bcf86cd799439020',
        user: '507f1f77bcf86cd799439012',
        rating: 5,
        comment: 'I am a test, I test things',
    });
    await review1.save();
};
const addTestUserToDatabase = async () => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('password', salt);
    const user = new User({
        _id: '507f1f77bcf86cd799439012',
        username: 'Test User',
        email: 'test@test.de',
        password: passwordHash,
    });

    await user.save();
};
const addAdminUserToDatabase = async () => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('passwordAdmin', salt);
    const user = new User({
        _id: '507f1f77bcf86cd799439015',
        username: 'Test AdminUser',
        email: 'test@test.de',
        password: passwordHash,
        admin: true,
    });

    await user.save();
};

module.exports = {
    connect,
    closeDatabase,
    clearDatabase,
    addTestMoviesToDatabase,
    addTestReviewToDatabase,
    addTestUserToDatabase,
    addAdminUserToDatabase,
};
