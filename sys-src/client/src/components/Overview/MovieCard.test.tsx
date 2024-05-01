import userEvent from '@testing-library/user-event';
import { IMovie } from '../../model/IMovie';
import { render, screen } from '../../utils/test-utils';
import MovieCard from './MovieCard';

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

    return <MovieCard movie={movieTest} />;
};

describe('Test MovieCard Component', () => {
    test('check UI elements', () => {
        render(<Wrapper />);

        //check if main movieCard rendered
        const mainDiv = screen.getByTestId('movieCard-main');
        expect(mainDiv).toBeInTheDocument();

        //check movie title
        const title = screen.getByTestId('movieCard-title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe('Titel');

        //check movie cover
        const image = screen.getByTestId('movieCard-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'http://localhost:9999/cover.png');

        //check movie rating
        const rating = screen.getByTestId('movieCard-rating');
        expect(rating).toBeInTheDocument();
        expect(rating.textContent).toBe('2');

        //check movie rating image
        const ratingImage = screen.getByTestId('movieCard-ratingImage');
        expect(ratingImage).toBeInTheDocument();
        expect(ratingImage).toHaveAttribute('src', 'star.png');
    });

    test('test trailer button', async () => {
        const result = render(<Wrapper />);
        const user = userEvent.setup();

        //test trailer button functionality
        const trailerBtn = result.getByTestId('movieCard-trailerBtn');
        expect(trailerBtn).toBeInTheDocument();

        await user.click(trailerBtn);

        //check if trailer dialog opened
        const trailerDialog = screen.getByTestId('trailerDialog');
        expect(trailerDialog).toBeInTheDocument();
    });

    test('test navigation', async () => {
        const result = render(<Wrapper />);
        const user = userEvent.setup();

        //check navigation actionCard
        const navCard = result.getByTestId('movieCard-navigate');
        expect(navCard).toBeInTheDocument();

        await user.click(navCard);

        //check url path
        expect(global.window.location.pathname).toBe('/film/random_id');
    });
});
