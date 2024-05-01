const mockDb = require('../test/mockDb');
const app = require('../server');
const request = require('supertest');

const agent = request.agent(app);

beforeAll(async () => { await mockDb.connect(); await mockDb.addTestMoviesToDatabase()});
afterEach(async () => await mockDb.clearDatabase());
afterAll(async () => await mockDb.closeDatabase());

describe("Search for Movies", () => {
    it("should find the movie gladiator", async () => {
        const response = await agent.get('/search/?q=gladiator');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('Gladiator');
    });
    it("shouldn't find the movie matrix", async () => {
        const response = await agent.get('/search/?q=matrix');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });
})