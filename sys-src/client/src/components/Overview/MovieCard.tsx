import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
} from '@mui/material';
import ApiRouter from '../../api/ApiRouter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IMovie } from '../../model/IMovie';
import TrailerDialog from '../TrailerDialog/TrailerDialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholder from './placeholder.png';

interface IProps {
    movie: IMovie;
}

const MovieCard = ({ movie }: IProps) => {
    const navigate = useNavigate();
    const [openTrailerDialog, setOpenTrailerDialog] = useState<boolean>(false);

    /*Open Trailer*/
    const handleOpenDialog = () => setOpenTrailerDialog(true);

    /*Navigation to MovieDetails Page*/
    const handleNavigate = () => {
        navigate(`film/${movie._id}`);
    };
    /*Build MovieCard*/
    return (
        <>
            {openTrailerDialog && (
                <TrailerDialog
                    open={openTrailerDialog}
                    setOpen={setOpenTrailerDialog}
                    movie={movie}
                />
            )}

            <div
                data-testid="movieCard-main"
                className="m-3 flex items-center justify-between"
                key={movie._id}
            >
                <Card
                    data-testid="movieCard-card"
                    style={{ maxHeight: 435, maxWidth: 240, padding: 0 }}
                >
                    <CardActionArea
                        onClick={handleNavigate}
                        data-testid="movieCard-navigate"
                    >
                        <CardMedia
                            data-testid="movieCard-image"
                            className="w-full h-auto aspect-[2/3]"
                            component="img"
                            src={
                                movie.image
                                    ? ApiRouter.getImageLink(movie.image)
                                    : placeholder
                            }
                            alt="Movie Poster"
                        ></CardMedia>
                    </CardActionArea>
                    <CardContent
                        className="content-center"
                        style={{
                            maxHeight: 75,
                            maxWidth: 240,
                            justifyContent: 'top',
                            padding: 0,
                        }}
                    >
                        <div
                            style={{
                                display: 'block',
                                height: 25,
                                paddingTop: 5,
                            }}
                        >
                            <p className="text-sm">
                                <b data-testid="movieCard-title">
                                    {movie.title}
                                </b>
                            </p>
                        </div>
                        <div className="px-4 py-2 h-20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <p className="mr-2">
                                        <b data-testid="movieCard-rating">
                                            {movie.rating
                                                ? Math.round(
                                                      movie.rating * 10
                                                  ) / 10
                                                : '--'}
                                        </b>
                                    </p>
                                    <img
                                        data-testid="movieCard-ratingImage"
                                        src={require('./star.png')}
                                        alt="star"
                                        className="w-4 h-4"
                                    />
                                </div>
                                <Button
                                    data-testid="movieCard-trailerBtn"
                                    startIcon={<PlayArrowIcon />}
                                    onClick={handleOpenDialog}
                                >
                                    Trailer
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default MovieCard;
