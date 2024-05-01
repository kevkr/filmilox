import { fireEvent, render, screen } from '../../utils/test-utils';
import { IMovie } from '../../model/IMovie';
import { useState } from 'react';
import { IReviewGet } from '../../model/IReview';
import { AddReview } from './AddReview';
import { act } from 'react-dom/test-utils';

const Wrapper = () => {
    const movieTest: IMovie = {
        _id: 'random_id',
        title: 'Titel',
        description: 'Beschreibung',
        trailer: 'Trailer-Link',
        release: new Date(),
        image: '/cover.png',
        rating: 2,
    };
    const [movie, setMovie] = useState<IMovie>(movieTest);
    const [reviews, setReviews] = useState<IReviewGet[]>([]);

    return (
        <AddReview
            open={true}
            onClose={jest.fn()}
            movie={movie}
            movieId={movie._id}
            setReviews={setReviews}
            setMovie={setMovie}
        />
    );
};
describe('Test AddReview component', () => {
    test('Check UI elements', () => {
        const { getByText } = render(<Wrapper />);

        const window = screen.getByTestId('addreview-window');
        expect(window).toBeInTheDocument();

        const cover = screen.getByTestId('addreview-cover');
        expect(cover).toBeInTheDocument();

        const rating = screen.getByTestId('addreview-rating');
        expect(rating).toBeInTheDocument();
        expect(rating.querySelectorAll('svg').length).toBe(10);

        const ratingError = screen.getByTestId('addreview-ratingerror');
        expect(ratingError).toBeInTheDocument();

        const comment = screen.getByTestId('addreview-comment');
        expect(comment).toBeInTheDocument();

        const commentLength = screen.getByTestId('addreview-commentlength');
        expect(commentLength).toBeInTheDocument();

        const button = screen.getByTestId('addreview-button');
        expect(button).toBeInTheDocument();

        const error = screen.getByTestId('addreview-error');
        expect(error).toBeInTheDocument();
    });

    test('Check values', () => {
        const { getByText } = render(<Wrapper />);

        //check if all stars are unset
        const rating = screen
            .getByTestId('addreview-rating')
            .querySelectorAll('svg');
        rating.forEach((rate) => {
            expect(rate.getAttribute('data-testid')).toBe('StarBorderIcon');
        });

        //check if textfield is empty
        const comment = screen
            .getByTestId('addreview-comment')
            .querySelector('textarea');
        expect(comment).toHaveTextContent('');

        //check if empty textfield length
        const commentLength = screen.getByTestId('addreview-commentlength');
        expect(commentLength).toHaveTextContent('0/2000');
    });

    test('Test adding text to TextField', () => {
        const { getByTestId } = render(<Wrapper />);

        const comment = screen
            .getByTestId('addreview-comment')
            .querySelector('textarea');

        act(() => {
            comment &&
                fireEvent.change(comment, {
                    target: { value: 'foo' },
                });
        });

        expect(comment).toHaveTextContent('foo');
    });

    test('Test submission with unset rating', () => {
        const { getByText } = render(<Wrapper />);

        const button = screen.getByTestId('addreview-button');
        act(() => {
            button.click();
        });

        const ratingError = screen.getByTestId('addreview-ratingerror');
        expect(ratingError).toHaveTextContent('Sternbewertung fehlt!');

        const window = screen.getByTestId('addreview-window');
        expect(window).toBeInTheDocument();
    });

    test('Test submission with set rating (5 stars)', () => {
        const { getByText } = render(<Wrapper />);

        const rating = screen.getByTestId('addreview-rating');
        act(() => {
            rating.querySelectorAll('label')[4].click();
        });
        rating.querySelectorAll('svg').forEach((rate, index) => {
            if (index <= 4)
                expect(rate.getAttribute('data-testid')).toBe('StarIcon');
            else
                expect(rate.getAttribute('data-testid')).toBe('StarBorderIcon');
        });

        const button = screen.getByTestId('addreview-button');
        act(() => {
            button.click();
        });

        const ratingError = screen.getByTestId('addreview-ratingerror');
        expect(ratingError).toHaveTextContent('');
    });
});
