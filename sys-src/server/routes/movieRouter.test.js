const mockDb = require('../test/mockDb');
const app = require('../server');
const request = require('supertest');

const agent = request.agent(app);

jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = '507f1f77bcf86cd799439015';
    return next();
});

beforeAll(async () => {
    await mockDb.connect();
    await mockDb.addTestMoviesToDatabase();
});
afterEach(async () => await mockDb.clearDatabase());
afterAll(async () => await mockDb.closeDatabase());

//"507f1f77bcf86cd799439010"
describe('tests to get a movie', () => {
    test('test valid movie Id', async () => {
        const movie = await agent.get(
            '/admin/get-movie/507f1f77bcf86cd799439020'
        );
        expect(movie.statusCode).toBe(200);
        expect(movie.body.title).toBe('Test movie');
        expect(movie.body.description).toBe('Description of the test movie.');
        expect(new Date(movie.body.release).toLocaleString()).toBe(
            new Date('1/1/2001').toLocaleString()
        );
        expect(movie.body.trailer).toBe('youtube link');
        expect(movie.body.image).toBe('image id');
        expect(movie.body.rating).toBe(0);
    });

    test('test invalid movie Id', async () => {
        const movie = await agent.get(
            '/admin/get-movie/507f1f77bcf86cd799439040'
        );
        expect(movie.statusCode).toBe(400);

        const errormovie = await agent.get('/admin/get-movie/1');
        expect(errormovie.statusCode).toBe(500);
    });

    test('add movie (Unathorized)', async () => {
        function FormDataMock() {
            this.append = jest.fn();
        }

        global.FormData = FormDataMock;
        var formData = new FormData();

        formData.append('title', 'Titel');
        formData.append('description', 'Description');
        formData.append('releaseDate', '13.08.1973');
        formData.append('trailer', 'https://www.youtube.com');

        const review0 = await agent.post('/admin/add-movie').send({ formData });
        expect(review0.statusCode).toBe(401);
    });

    test('add movie (Authorized)', async () => {
        function FormDataMock() {
            this.append = jest.fn();
        }

        global.FormData = FormDataMock;
        await mockDb.addAdminUserToDatabase();

        var formData = new FormData();

        formData.append('title', 'Titel');
        formData.append('description', 'Description');
        formData.append('releaseDate', '13.08.1973');
        formData.append('trailer', 'https://www.youtube.com');

        const review0 = await agent.post('/admin/add-movie').send({ formData });
        expect(review0.statusCode).toBe(500);
    });
});
