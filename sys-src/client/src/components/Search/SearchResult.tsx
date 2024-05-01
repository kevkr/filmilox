import React, { useEffect, useState } from 'react';
import {
    NavigateFunction,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import Backend from '../../api/Backend';
import { IMovieWithID } from '../../model/IMovie';
import ApiRouter from '../../api/ApiRouter';
import { format } from 'date-fns';

function SearchResult() {
    const [searchParams] = useSearchParams();
    const [searchResult, setSearchResult] =
        useState<Map<string | null, Array<IMovieWithID>>>();
    const searchQuery: string | null = searchParams.get('find');
    const navigate: NavigateFunction = useNavigate();

    function handleNavigation(movieId: string): void {
        navigate('/film/' + movieId);
    }

    useEffect(() => {
        if (searchQuery && !searchResult?.get(searchQuery)) {
            const fetchSearchResults = async () => {
                const searchResults: Array<IMovieWithID> = await Backend.search(
                    searchQuery
                );
                setSearchResult(
                    new Map<string | null, Array<IMovieWithID>>([
                        [searchQuery, searchResults],
                    ])
                );
            };
            fetchSearchResults().catch(console.error);
        }
    });

    return (
        <div className="flex flex-col justify-center w-full laptop:mx-16 mx-4">
            <h1 className="text-2xl laptop:text-4xl my-10 ">
                Results: {searchQuery}
            </h1>
            {(!searchResult ||
                searchResult?.get(searchQuery)?.length === 0) && (
                <p>No results.</p>
            )}
            {searchResult?.get(searchQuery)?.map((movie: IMovieWithID) => {
                return (
                    <div
                        className="flex flex-row shadow-md mb-4 p-4 w-11/12"
                        key={movie._id}
                    >
                        {!movie.image && (
                            <div
                                className="min-w-[8rem] h-48 mr-10 mb-4 bg-gray-300 cursor-pointer text-8xl text-slate-100 text-center align-middle"
                                style={{ lineHeight: '10rem' }}
                                onClick={() => handleNavigation(movie._id)}
                            >
                                ?
                            </div>
                        )}
                        {movie.image && (
                            <img
                                className="w-32 h-48 mr-10 drop-shadow-md mb-4 cursor-pointer"
                                src={
                                    movie.image &&
                                    ApiRouter.getImageLink(movie.image)
                                }
                                onClick={() => handleNavigation(movie._id)}
                                alt=""
                            />
                        )}
                        <div className="flex flex-col justify-start">
                            <h2 className="text-2xl font-semibold mb-2">
                                <a href={'/film/' + movie._id}>{movie.title}</a>
                                <span className="font-normal">
                                    {' '}
                                    (
                                    {movie.release &&
                                        format(new Date(movie.release), 'yyyy')}
                                    )
                                </span>
                            </h2>
                            <p className="text-sm max-h-16 font-medium laptop:w-1/2 line-clamp-3">
                                {movie.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default SearchResult;
