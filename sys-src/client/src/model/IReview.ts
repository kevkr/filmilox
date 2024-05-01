export interface IReviewAdd {
    movieId: string;
    rating: number;
    comment: string;
}

export interface IReviewGet {
    _id: string;
    user: { _id: string; username: string };
    movie: any;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}
