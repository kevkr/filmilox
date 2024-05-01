import axios from 'axios';
import Backend from './Backend';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Testing Backend class', () => {
    it('should register a new user', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.register({
            email: 'test@local.dev',
            username: 'test',
            password: 'testtest',
        });
        expect(result).toEqual('success');
    });
    it('should throw an error when registering a new user goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.register({
                email: 'test@local.dev',
                username: 'test',
                password: 'testtest',
            });
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should login a user', async () => {
        const mockedResponse = {
            data: {
                token: 'testtoken',
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        const spy = jest.spyOn(Storage.prototype, 'setItem');
        await Backend.login({ password: 'testtest', identifier: 'test' });
        expect(spy).toHaveBeenCalled();
    });
    it('should throw an error when logging in a user goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.login({ password: 'testtest', identifier: 'test' });
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should add a review', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.addreview({
            movieId: 'test',
            rating: 5,
            comment: 'test',
        });
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when adding a review goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.addreview({
                movieId: 'test',
                rating: 5,
                comment: 'test',
            });
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should get a review', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.getReview({ movieId: 'test' });
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when getting a review goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.getReview({ movieId: 'test' });
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should get a username', async () => {
        const mockedResponse = {
            data: {
                username: 'test',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.getUsername({ userId: 'test' });
        expect(result).toEqual('test');
    });
    it('should throw an error when getting a username goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.getUsername({ userId: 'test' });
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should add a movie', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.addMovie({} as FormData);
        expect(result).toEqual('success');
    });
    it('should throw an error when adding a movie goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.addMovie({} as FormData);
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should get a movie by id', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.getMovie({ _id: 'test' });
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when getting a movie by id goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.getMovie({ _id: 'test' });
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should return search results', async () => {
        const mockedResponse = { data: { status: 'success' } };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.search('test');
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when searching goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.search('test');
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should delete a review', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        const setReviews = jest.fn();
        const setMovie = jest.fn();
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        await Backend.deleteReview('test', setReviews, setMovie);
        expect(setMovie).toHaveBeenCalled();
        expect(setReviews).toHaveBeenCalled();
    });
    it('should throw an error when deleting a review goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.deleteReview('test', jest.fn(), jest.fn());
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should be able to cast votes on reviews', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.vote('test', true);
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when voting on a review goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.vote('test', true);
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should be able to retrieve vote counts', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.getVotes('test');
        expect(result).toEqual({ data: { status: 'success' } });
    });
    it('should throw an error when retrieving vote counts goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.getVotes('test');
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should be able find a users existing vote', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.getExistingUserVote('test');
        expect(result).toEqual({ data: { status: 'success' } });
    });
    it('should throw an error when finding a users existing vote goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.getExistingUserVote('test');
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should get a list of all movies', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.getAllMovies();
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when getting all movies goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.get.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.getAllMovies();
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
    it('should be able to update the user profile', async () => {
        const mockedResponse = {
            data: {
                status: 'success',
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockedResponse);
        const result = await Backend.updateProfile({} as FormData);
        expect(result).toEqual({ status: 'success' });
    });
    it('should throw an error when updating the user profile goes wrong', async () => {
        const mockedResponse = {
            data: {
                status: 'error',
            },
        };
        mockedAxios.post.mockRejectedValueOnce(mockedResponse);
        try {
            await Backend.updateProfile({} as FormData);
        } catch (e: any) {
            expect(e.data.status).toEqual('error');
        }
    });
});
