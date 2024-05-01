import Review from './Review';
import { IMovie } from '../../model/IMovie';
import { IReviewGet } from '../../model/IReview';
import { useState } from 'react';
import { render } from '../../utils/test-utils';
import Backend from '../../api/Backend';
import { waitFor } from '@testing-library/react';
//movie data to be matched against expected test values
const movieTest: IMovie = {
    _id: 'random_id',
    title: 'Titel',
    description: 'Beschreibung',
    trailer: 'Trailer-Link',
    release: new Date(),
    image: '/cover.png',
    rating: 2,
};
//review data to be matched against expected test values
const reviewTest: IReviewGet = {
    _id: 'test_id',
    user: { _id: 'test_id', username: 'TestUser' },
    movie: 'random_id',
    rating: 2,
    comment: 'Beschreibung',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
};

jest.mock('../../api/Backend');

const Wrapper = () => {
    // hooks to reuse movie and review logic
    const [movie, setMovie] = useState<IMovie>(movieTest);
    const [reviews, setReviews] = useState<IReviewGet[]>([]);
    return (
        <Review
            setMovie={setMovie}
            setReviews={setReviews}
            review={reviewTest}
        />
    );
};

describe('Test Voting on Review', () => {
    it('should render the placeholders if no votes are found', async () => {
        jest.spyOn(Backend, 'getVotes').mockResolvedValue({
            data: {
                upvote: 0,
                downvote: 0,
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        });
        const { getByTestId } = render(<Wrapper />);

        await waitFor(() => {
            const downvotePlaceholder = getByTestId(
                'downvote-count-placeholder'
            );
            const upvotePlaceholder = getByTestId('upvote-count-placeholder');
            expect(downvotePlaceholder).toBeInTheDocument();
            expect(upvotePlaceholder).toBeInTheDocument();
        });
    });
    it('should display the vote counts', async () => {
        jest.spyOn(Backend, 'getVotes').mockResolvedValue({
            data: {
                upvote: 100,
                downvote: 50,
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        });
        const { getByTestId } = render(<Wrapper />);
        await waitFor(() => {
            const downvoteCount = getByTestId('downvote-count');
            const upvoteCount = getByTestId('upvote-count');
            expect(downvoteCount).toBeInTheDocument();
            expect(downvoteCount).toHaveTextContent('50');
            expect(upvoteCount).toBeInTheDocument();
            expect(upvoteCount).toHaveTextContent('100');
        });
    });
});
// test if UI elements of the Review component are rendered as expected
describe('Test Review component', () => {
    test('Check if all elements are present.', async () => {
        jest.spyOn(Backend, 'getVotes').mockResolvedValue({
            data: {
                upvote: 0,
                downvote: 0,
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        });
        const { getByTestId } = render(<Wrapper />);
        // Wait until the callback does not throw an error
        // it'll wait until the function has been called once.
        await waitFor(() => {
            //check main div is rendered in the review component
            const ReviewId = getByTestId('review-main');
            expect(ReviewId).toBeInTheDocument();
            //check username in the review
            const username = getByTestId('review-username');
            expect(username).toBeInTheDocument();
            expect(username.textContent).toEqual('@TestUser');

            //check rating in the review
            const rating = getByTestId('review-rating');
            expect(rating).toBeInTheDocument();

            // check date of the review
            const reviewDate = getByTestId('review-date');
            expect(reviewDate).toBeInTheDocument();

            //check the comment of the review
            const comment = getByTestId('review-comment');
            expect(comment).toBeInTheDocument();
            expect(comment.textContent).toBe('Beschreibung');
        });
    });
});
