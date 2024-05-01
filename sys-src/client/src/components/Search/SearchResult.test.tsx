import { render } from '../../utils/test-utils';
import SearchResult from './SearchResult';
import { IMovieWithID } from '../../model/IMovie';
import Backend from '../../api/Backend';
import { waitFor } from '@testing-library/react';

const movieTest1: IMovieWithID = {
    _id: 'random_id',
    title: 'Titel',
    description: 'Beschreibung',
    trailer: 'Trailer-Link',
    release: new Date(),
    image: '/cover.png',
    rating: 2,
};

const movieTest2: IMovieWithID = {
    _id: 'random_id2',
    title: 'Titel2',
    description: 'Beschreibung',
    trailer: 'Trailer-Link',
    release: new Date(),
    image: '/cover.png',
    rating: 3,
};

const Wrapper = () => {
    return <SearchResult />;
};

describe('Test SearchResult component, with no result', () => {
    it('should render search results heading', () => {
        const { getByText } = render(<Wrapper />);

        expect(
            getByText('Results:', { selector: 'h1' })
        ).toBeInTheDocument();
    });

    it('should render no search results found', () => {
        const { getByText } = render(<Wrapper />);

        expect(
            getByText('No results.', { selector: 'p' })
        ).toBeInTheDocument();
    });
});

describe('Test SearchResult component, with results', () => {
    it('should render two search results ', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue('Titel');
        jest.spyOn(Backend, 'search').mockResolvedValue([
            movieTest1,
            movieTest2,
        ]);
        const { getByText } = render(<Wrapper />);

        await waitFor(() => {
            expect(
                getByText('Results: Titel', { selector: 'h1' })
            ).toBeInTheDocument();
            expect(getByText(movieTest1.title)).toBeInTheDocument();
            expect(getByText(movieTest2.title)).toBeInTheDocument();
        });
    });
});
