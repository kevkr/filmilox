import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Backend from '../api/Backend';
import { IMovie } from '../model/IMovie';
import { IReviewGet } from '../model/IReview';
import { useAppSelector } from '../redux/hooks';
import { selectIsLoggedIn } from '../redux/userSlice';
import { AddReview } from './Review/AddReview';
import Review from './Review/Review';
import MovieDetails from './MovieDetails/MovieDetails';

function FilmOverview() {
    const params = useParams();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const [openAddReview, setOpenAddReview] = useState<boolean>(false);
    const [movie, setMovie] = useState<IMovie | undefined>();
    const [reviews, setReviews] = useState<IReviewGet[]>([]);

    const handleAddReviewClose = () => {
        setOpenAddReview(false);
    };

    const handleAddReviewClick = () => {
        setOpenAddReview(true);
    };

    useEffect(() => {
        const getMovie = async () => {
            if (!params.filmId) return;
            const movieData = await Backend.getMovie({ _id: params.filmId });
            setMovie(movieData);

            const reviewsData = await Backend.getReview({
                movieId: params.filmId,
            });
            setReviews(reviewsData);
        };
        getMovie();
    }, [params]);

    return (
        <div className="flex flex-col justify-center w-full items-center">
            {isLoggedIn && openAddReview && params.filmId && movie && (
                <AddReview
                    open={openAddReview}
                    onClose={handleAddReviewClose}
                    movie={movie}
                    movieId={params.filmId}
                    setReviews={setReviews}
                    setMovie={setMovie}
                />
            )}
            <MovieDetails
                movie={movie}
                handleAddReviewClick={handleAddReviewClick}
            />
            {reviews.map((review: IReviewGet) => (
                <Review
                    review={review}
                    setReviews={setReviews}
                    key={review._id}
                    setMovie={setMovie}
                />
            ))}
        </div>
    );
}

export default FilmOverview;
