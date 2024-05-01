import Backend from '../../api/Backend';
import { IMovie } from '../../model/IMovie';
import { act, render, screen, waitFor } from '../../utils/test-utils';
import Overview from './Overview';

const movieTest: IMovie = {
    _id: 'random_id',
    title: 'Titel',
    description: 'Beschreibung',
    trailer: 'Trailer-Link',
    release: new Date(),
    image: '/cover.png',
    rating: 2,
};

jest.mock('../../api/Backend');

const Wrapper = () => {
    return <Overview />;
};

describe('Test MovieCard Component', () => {
    test('check UI elements without movies', () => {
        render(<Wrapper />);

        //check empty main overview
        const mainDiv = screen.getByTestId('overview-main');
        expect(mainDiv).toBeInTheDocument();
        expect(mainDiv.textContent).toBe('');
    });

    test('check UI elements with movies', async () => {
        act(() => {
            jest.spyOn(Backend, 'getAllMovies').mockResolvedValue({
                movies: [movieTest],
            });

            render(<Wrapper />);
        });

        await waitFor(() => {
            const mCards = screen.getAllByTestId('movieCard-main');

            mCards.forEach((card) => expect(card).toBeInTheDocument());
            expect(mCards).toHaveLength(1);
        });
    });
});
