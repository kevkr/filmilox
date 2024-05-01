import Axios, { AxiosResponse } from 'axios';
import ApiRouter from './ApiRouter';
import {
    ILoginResponse,
    IMovieResponse,
    IRegisterResponse,
} from '../model/IResponse';
import { IRegister } from '../model/IRegister';
import { ILogin } from '../model/ILogin';
import { IUser } from '../model/IUser';
import { IReviewAdd } from '../model/IReview';
import { IMovie, IMovieWithID } from '../model/IMovie';
import { IUserVote, IVote } from '../model/IVote';

export default class Backend {
    static register = async ({ email, username, password }: IRegister) => {
        try {
            const {
                data: { status },
            } = await Axios.post<IRegisterResponse>(ApiRouter.Register, {
                email,
                username,
                password,
            });
            return status;
        } catch (e) {
            throw e;
        }
    };

    static login = async ({ password, identifier }: ILogin) => {
        try {
            const {
                data: { token },
            } = await Axios.post<ILoginResponse>(ApiRouter.Login, {
                password,
                identifier,
            });
            localStorage.setItem('token', token);
        } catch (e) {
            throw e;
        }
    };

    static addreview = async ({ movieId, rating, comment }: IReviewAdd) => {
        try {
            const { data } = await Axios.post(
                ApiRouter.AddReview,
                { movieId, rating, comment },
                ApiRouter.createHeaders()
            );
            return data;
        } catch (e) {
            throw e;
        }
    };

    static getReview = async ({ movieId }: { movieId: string }) => {
        try {
            const url = `${ApiRouter.GetReview}/${movieId}`;
            const { data } = await Axios.get(url);
            return data;
        } catch (e) {
            throw e;
        }
    };

    static getUsername = async ({ userId }: { userId: string }) => {
        try {
            const url = `${ApiRouter.GetUsername}/${userId}`;
            const { data } = await Axios.get(url);
            return data.username;
        } catch (e) {
            throw e;
        }
    };

    static addMovie = async (formData: FormData) => {
        try {
            const {
                data: { status },
            } = await Axios.post<IMovieResponse>(
                ApiRouter.AddMovie,
                formData,
                ApiRouter.createHeaders()
            );
            return status;
        } catch (e) {
            throw e;
        }
    };
    static getMovie = async ({ _id }: { _id: string }) => {
        try {
            const url = `${ApiRouter.GetMovieData}/${_id}`;
            const { data } = await Axios.get<IMovie>(url);
            return data;
        } catch (e) {
            throw e;
        }
    };

    static search = async (query: string) => {
        try {
            const { data } = await Axios.get<Array<IMovieWithID>>(
                `${ApiRouter.Search}?q=${query}`
            );
            return data;
        } catch (e) {
            throw e;
        }
    };

    static deleteReview = async (
        reviewId: string,
        setReviews: any,
        setMovie: any
    ) => {
        try {
            const { data } = await Axios.post(
                ApiRouter.DeleteReview,
                { reviewId: reviewId },
                ApiRouter.createHeaders()
            );
            setReviews((reviews: any) => {
                const oldReviews = [...reviews];
                const index = oldReviews.findIndex(
                    (item) => item._id === reviewId
                );

                if (index !== -1) {
                    oldReviews.splice(index, 1);
                    return oldReviews;
                }
                return reviews;
            });
            setMovie(data);
        } catch (e) {
            throw e;
        }
    };

    static vote = async (reviewId: string, isUpvote: boolean) => {
        try {
            const { data } = await Axios.post(
                ApiRouter.SubmitVote,
                { reviewId, isUpvote },
                ApiRouter.createHeaders()
            );
            return data;
        } catch (e) {
            throw e;
        }
    };

    static getVotes = async (reviewId: string) => {
        try {
            const data: AxiosResponse<IVote> = await Axios.get<IVote>(
                `${ApiRouter.GetVotes}/${reviewId}`
            );
            return data;
        } catch (e) {
            throw e;
        }
    };

    static getExistingUserVote = async (reviewId: string) => {
        try {
            const data: AxiosResponse<IUserVote> = await Axios.get<IUserVote>(
                `${ApiRouter.GetExistingUserVote}/${reviewId}`,
                ApiRouter.createHeaders()
            );
            return data;
        } catch (e) {
            throw e;
        }
    };

    static getAllMovies = async () => {
        try {
            const { data } = await Axios.get(ApiRouter.GetAllMovies);
            return data;
        } catch (e) {
            throw e;
        }
    };

    /*Update User Profile*/
    static updateProfile = async (formData: FormData) => {
        try {
            const { data } = await Axios.post<IUser>(
                ApiRouter.UpdateProfile,
                formData,
                ApiRouter.createHeaders()
            );
            return data;
        } catch (e) {
            throw e;
        }
    };
}
