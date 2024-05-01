import {
    Button,
    Dialog,
    FormHelperText,
    Grid,
    Rating,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ApiRouter from '../../api/ApiRouter';
import Backend from '../../api/Backend';
import { IMovie } from '../../model/IMovie';

interface Props {
    open: boolean;
    onClose(): void;
    movie: IMovie;
    movieId: string;
    setReviews: any;
    setMovie: any;
}

/**
 * Creates a popup window and allows the logged in user to rate the movie between 1 and 10 stars,
 * and the user can optionally add a text with up to 2000 characters
 * @param props: {open: boolean, onClose(): void, movieId: string}
 * @returns component
 */
export const AddReview = (props: Props) => {
    const { open, onClose, movie, movieId, setReviews, setMovie } = props;
    const commentMaxLength: number = 2000;

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [ratingError, setRatingError] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * If the length of the event's target's value is less than or equal to the commentMaxLength,
     * then the function sets the comment to the event's target's value.
     * @param {React.ChangeEvent<HTMLInputElement>} event
     */
    const handleCommentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.value.length <= commentMaxLength)
            setComment(event.target.value);
    };

    /**
     * If the value is null then return, else change the rating based on the value.
     * @param {React.SyntheticEvent} event - ,
     * @param {number | null} value - number | null
     */
    const handleRatingChange = (
        event: React.SyntheticEvent,
        value: number | null
    ) => {
        if (value === null) return;
        if (value < 1) setRating(1);
        else if (value > 10) setRating(10);
        else setRating(value);
    };

    /**
     * If the rating is 0, set the ratingError to 'Sternbewertung fehlt!' and return. Otherwise, try
     * to add the review, and if it fails, set the error to 'Submission failed!' and throw the error.
     * @returns the result of the async function.
     */
    const submitReview = async () => {
        if (rating === 0) {
            setRatingError('Sternbewertung fehlt!');
            return;
        }
        try {
            const newReview = await Backend.addreview({
                movieId,
                rating,
                comment,
            });
            setReviews((review: any) => {
                return [...review, newReview];
            });
            setMovie(newReview.movie);
            onClose();
        } catch (error) {
            setError('Submission failed!');
        }
    };

    /* Resetting the ratingError to an empty string whenever the rating changes. */
    useEffect(() => {
        setRatingError('');
    }, [rating]);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth={'md'}
                data-testid="addreview-window"
            >
                <Grid container spacing={2} textAlign={'center'}>
                    <Grid item xs={12} sx={{ mt: 4 }}>
                        <img
                            className="tablet:w-48 w-full mx-auto"
                            src={
                                movie?.image &&
                                ApiRouter.getImageLink(movie.image)
                            }
                            alt={movie.title}
                            data-testid="addreview-cover"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Rating
                            max={10}
                            value={rating}
                            defaultValue={0}
                            onChange={handleRatingChange}
                            sx={{ fontSize: 60 }}
                            data-testid="addreview-rating"
                        ></Rating>
                        <FormHelperText
                            error
                            sx={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}
                            data-testid="addreview-ratingerror"
                        >
                            {ratingError}
                        </FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            multiline
                            rows={6}
                            sx={{ width: 800 }}
                            onChange={handleCommentChange}
                            value={comment || ''}
                            label={'Kommentar'}
                            variant={'filled'}
                            data-testid="addreview-comment"
                        ></TextField>
                        <FormHelperText
                            error={comment.length >= 2000 ? true : false}
                            sx={{
                                width: 800,
                                textAlign: 'right',
                                alignContent: 'center',
                                mx: 'auto',
                            }}
                            data-testid="addreview-commentlength"
                        >{`${comment.length}/${commentMaxLength}`}</FormHelperText>
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 4 }}>
                        <Button
                            variant="contained"
                            onClick={submitReview}
                            sx={{
                                fontSize: 20,
                                width: 300,
                                borderRadius: 10,
                            }}
                            data-testid="addreview-button"
                        >
                            Bewerten
                        </Button>

                        <FormHelperText
                            error
                            sx={{
                                fontSize: 16,
                                textAlign: 'center',
                                mt: 2,
                            }}
                            data-testid="addreview-error"
                        >
                            {error}
                        </FormHelperText>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    );
};
