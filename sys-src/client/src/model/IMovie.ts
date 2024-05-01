export interface IMovie {
    _id: string;
    title: string;
    description: string;
    trailer: string;
    release: Date | null;
    image?: string;
    rating?: number;
}

export interface IMovieWithID extends IMovie {
    _id: string;
}
