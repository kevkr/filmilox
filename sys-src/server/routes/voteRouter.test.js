const mockDb = require('../test/mockDb');
const app = require('../server');
const request = require('supertest');

const agent = request.agent(app);

jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = "507f1f77bcf86cd799439012";
    return next();
});

beforeAll(async () => {
    await mockDb.connect();
});
beforeEach(async () => {await mockDb.addTestMoviesToDatabase(); await mockDb.addTestReviewToDatabase();});
afterEach(async () => await mockDb.clearDatabase());
afterAll(async () => await mockDb.closeDatabase());

describe("get cummulative votes on review", () => {
    it("shouldn't find any votes", async () => {
        const review = await agent.get('/film/getreview/507f1f77bcf86cd799439011');
        const response = await agent.get('/votes/' + review.body[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.downvote).toBe(0);
        expect(response.body.upvote).toBe(0);
    });
    it("should return an error if the review doesn't exist", async () => {
        const response = await agent.get('/votes/507f1f77bcf86cd799439013');
        expect(response.statusCode).toBe(404);
    });
    it("should return an internal server error if the reviewId is messed up", async () => {
        const response = await agent.get('/votes/iamamessedupreviewid');
        expect(response.statusCode).toBe(500);
    });
})

describe("submit vote on review", () => {
    it("should a submit a vote", async () => {
        const review = await agent.get('/film/getreview/507f1f77bcf86cd799439011');
        const response = await agent.post('/votes/submitVote').send({reviewId: review.body[0]._id, isUpvote: true, user: '507f1f77bcf86cd799439012'});
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Vote added successfully.');
    });
    it("should return an error if the review doesn't exist", async () => {
        const response = await agent.post('/votes/submitVote').send({reviewId: '507f1f77bcf86cd799439013', isUpvote: true, user: '507f1f77bcf86cd799439012'});
        expect(response.statusCode).toBe(404);
    });
    it("should return an internal server error if the reviewId is messed up", async () => {
        const response = await agent.post('/votes/submitVote').send({reviewId: 'iamamessedupreviewid', isUpvote: true, user: '507f1f77bcf86cd799439012'});
        expect(response.statusCode).toBe(500);
    });
    it("should update the vote if it already exists", async () => {
        const review = await agent.get('/film/getreview/507f1f77bcf86cd799439011');
        const submitResponse = await agent.post('/votes/submitVote').send({reviewId: review.body[0]._id, isUpvote: true, user: '507f1f77bcf86cd799439012'});
        expect(submitResponse.statusCode).toBe(200);
        expect(submitResponse.body.message).toBe('Vote added successfully.');
        const updateResponse = await agent.post('/votes/submitVote').send({reviewId: review.body[0]._id, isUpvote: false, user: '507f1f77bcf86cd799439012'});
        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.message).toBe('Vote updated successfully.');
    });
});

describe("get vote if it already exists", () => {
    it("should get the existing vote", async () => {
        const review = await agent.get('/film/getreview/507f1f77bcf86cd799439011');
        const submitResponse = await agent.post('/votes/submitVote').send({reviewId: review.body[0]._id, isUpvote: true, user: '507f1f77bcf86cd799439012'});
        expect(submitResponse.statusCode).toBe(200);
        expect(submitResponse.body.message).toBe('Vote added successfully.');
        const response = await agent.get('/votes/existingVote/' + review.body[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.userVote).toBe(true);
    })
    it("should return undefined if the review doesn't exist", async () => {
        const response = await agent.get('/votes/existingVote/507f1f77bcf86cd799439013');
        expect(response.statusCode).toBe(200);
        expect(response.body.userVote).toBe(undefined);
    });
});