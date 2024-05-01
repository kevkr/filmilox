import { useEffect, useState } from 'react';
import Backend from '../../api/Backend';
import { IMovie } from '../../model/IMovie';
import MovieCard from './MovieCard';

function Overview() {
    const [movies, setMovies] = useState<IMovie[]>([]);

    /*Get all Movies from Backend to be shown in the Overview*/
    useEffect(() => {
        const fetchMovies = async () => {
            const data = await Backend.getAllMovies();
            if (data?.movies) setMovies(data.movies);
        };
        fetchMovies();
    }, []);

    return (
        <div
            data-testid="overview-main"
            className="text-center justify-center grid grid-col-1 tabLaptop:grid-cols-4 tablet:grid-cols-3 deLa:grid-cols-5 desktop:grid-cols-6 gap-4 p-8"
        >
            {shuffleMovies(movies).map((m) => (
                <MovieCard movie={m} key={m._id} />
            ))}
        </div>
    );
}

function shuffleMovies(movies: IMovie[]) {
    //Uses Durstenfeld shuffle, Source: https://stackoverflow.com/a/12646864/10568770
    for (let i: number = movies.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [movies[i], movies[j]] = [movies[j], movies[i]];
    }
    return movies;
}

export default Overview;
