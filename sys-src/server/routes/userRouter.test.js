const mockDb = require('../test/mockDb');
const app = require('../server');
const request = require('supertest');
const testData = require('../test/userRouter.testData');

const agent = request.agent(app);

beforeAll(async () => {
    await mockDb.connect();
});
beforeEach(async () => {
    await mockDb.addTestUserToDatabase();
});
afterEach(async () => await mockDb.clearDatabase());
afterAll(async () => await mockDb.closeDatabase());

jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = '507f1f77bcf86cd799439012';
    return next();
});

describe('tests to register a user', () => {
    testData.Register.forEach((item) => {
        test(item.test, async () => {
            const result = await agent.post('/user/register').send(item.data);
            expect(result.statusCode).toBe(item.statusCode);
        });
    });
});

describe('tests to login a user', () => {
    testData.Login.forEach((item) => {
        test(item.test, async () => {
            const result = await agent.post('/user/login').send(item.data);
            expect(result.statusCode).toBe(item.statusCode);
        });
    });
});

describe('tests to fetch init data', () => {
    testData.FetchData.forEach((item) => {
        test(item.test, async () => {
            const result = await agent.post('/user/fetch-data').send(item.data);
            expect(result.statusCode).toBe(item.statusCode);
        });
    });
});
