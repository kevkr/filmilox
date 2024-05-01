import { Card, IconButton, Rating } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { IReviewGet } from '../../model/IReview';
import { IUserVote, IVote } from '../../model/IVote';
import { useAppSelector } from '../../redux/hooks';
import {
    selectIsAdmin,
    selectIsLoggedIn,
    selectUsername,
} from '../../redux/userSlice';
import Backend from '../../api/Backend';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

interface Props {
    review: IReviewGet;
    setReviews: any;
    setMovie: any;
}

const Review = (props: Props) => {
    const { review, setReviews, setMovie } = props;
    const userName = useAppSelector(selectUsername);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const isAdmin = useAppSelector(selectIsAdmin);
    // hooks to reuse vote logic
    const [vote, setVote] = useState<IVote | undefined>();
    const [userVote, setUserVote] = useState<IUserVote>();
    //handle votes after first render and every update
    useEffect(() => {
        Backend.getVotes(review._id).then((response: AxiosResponse<IVote>) => {
            setVote(response.data);
        });
    }, [userVote, review]);

    useEffect(() => {
        if (isLoggedIn) {
            Backend.getExistingUserVote(review._id).then(
                (response: AxiosResponse<IUserVote>) => {
                    setUserVote(response.data);
                }
            );
        }
    }, [review, isLoggedIn]);
    //to delete a review
    const handleDelete = async () => {
        try {
            await Backend.deleteReview(review._id, setReviews, setMovie);
        } catch (e) {
            console.log(e);
        }
    };
    //handles up-, downvotes for a logged in user
    async function handleVote(isUpvote: boolean) {
        try {
            if (isLoggedIn) {
                setUserVote({ userVote: isUpvote });
            }
            await Backend.vote(review._id, isUpvote);
        } catch (e) {
            console.error(e);
        }
    }
    // build a review
    return (
        <div data-testid="review-main" className="max-w-7xl w-full mb-4">
            <Card className="w-full">
                <div className="p-6">
                    <div className="flex flex-col tablet:justify-between tablet:flex-row">
                        <div className="flex items-center justify-between">
                            <p
                                className="mr-4 text-xl text-gray-500 font-bold"
                                data-testid="review-username"
                            >
                                @{review.user.username}
                            </p>
                            <Rating
                                name="customized-10"
                                readOnly
                                defaultValue={review.rating}
                                max={10}
                                data-testid="review-rating"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <p
                                className="text-xl text-gray-500 font-bold mr-2"
                                data-testid="review-date"
                            >
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </p>
                            {(userName === review.user.username || isAdmin) && (
                                <IconButton
                                    aria-label="delete"
                                    onClick={handleDelete}
                                    color="error"
                                    data-testid="deletereview-button"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col tablet:flex-row">
                        <p className="mr-8" data-testid="review-comment">
                            {review.comment}
                        </p>
                        <div style={{ flexGrow: 1 }} />
                        <div className="flex justify-end tablet:items-end">
                            <div className="flex-col flex justify-center items-center">
                                <IconButton
                                    data-testid="upvote-icon-button"
                                    color={
                                        userVote?.userVote === true
                                            ? 'primary'
                                            : 'default'
                                    }
                                    onClick={() => {
                                        handleVote(true);
                                    }}
                                >
                                    <ThumbUpIcon />
                                </IconButton>
                                <p data-testid="upvote-count">
                                    {vote && vote.upvote}
                                </p>
                                <p data-testid="upvote-count-placeholder">
                                    {!vote && '--'}
                                </p>
                            </div>

                            <div className="flex-col flex justify-center items-center">
                                <IconButton
                                    data-testid="downvote-icon-button"
                                    color={
                                        userVote?.userVote === false
                                            ? 'error'
                                            : 'default'
                                    }
                                    onClick={() => {
                                        handleVote(false);
                                    }}
                                >
                                    <ThumbDownIcon />
                                </IconButton>
                                <p data-testid="downvote-count">
                                    {vote && vote.downvote}
                                </p>
                                <p data-testid="downvote-count-placeholder">
                                    {!vote && '--'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Review;
