const mockDb = require('../test/mockDb');
const app = require('../server');
const request = require('supertest');

const agent = request.agent(app);

jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = '507f1f77bcf86cd799439012';
    return next();
});

beforeAll(async () => {
    await mockDb.connect();
});
beforeEach(async () => {
    await mockDb.addTestUserToDatabase();
    await mockDb.addTestMoviesToDatabase();
    await mockDb.addTestReviewToDatabase();
});
afterEach(async () => await mockDb.clearDatabase());
afterAll(async () => await mockDb.closeDatabase());

describe('tests to add a review', () => {
    test('test invalid ratings', async () => {
        const review0 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            rating: 0,
            comment: 'lipsum comment',
        });
        expect(review0.statusCode).toBe(400);

        const review1 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            rating: 11,
            comment: 'lipsum comment',
        });
        expect(review1.statusCode).toBe(400);

        const review2 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            rating: 5.5,
            comment: 'lipsum comment',
        });
        expect(review2.statusCode).toBe(400);

        const review3 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            comment: 'lipsum comment',
        });
        expect(review3.statusCode).toBe(400);
    });

    test('test invalid movieId', async () => {
        const review0 = await agent.post('/film/addreview').send({
            rating: 9,
            comment: 'lipsum comment',
        });
        expect(review0.statusCode).toBe(400);

        const review1 = await agent.post('/film/addreview').send({
            movieId: '629091734c1f727d1492c1cb',
            rating: 9,
            comment: 'lipsum comment',
        });
        expect(review1.statusCode).toBe(404);
        expect(review1.error.text).toBe(
            '{"errors":[{"message":"The movie doesn\'t exist."}]}'
        );
    });

    test('test invalid comment', async () => {
        const review0 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            rating: 9,
            comment: 'l' * 2001,
        });
        expect(review0.statusCode).toBe(400);
    });

    test('add mulitple reviews to one movie', async () => {
        const review0 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            rating: 9,
            comment: 'lipsum',
        });
        expect(review0.statusCode).toBe(200);

        const review1 = await agent.post('/film/addreview').send({
            movieId: '507f1f77bcf86cd799439010',
            rating: 2,
            comment: 'lipsum lipsum',
        });
        expect(review1.statusCode).toBe(404);
        expect(review1.error.text).toBe(
            '{"errors":[{"message":"You can only add one review per movie."}]}'
        );
    });
});

test('get review to delete', async () => {
    const reviewToDelete = await agent.post('/film/deleteReview').send({
        reviewId: '507f1f77bcf86cd799439040',
    });
    expect(reviewToDelete.statusCode).toBe(200);
});
