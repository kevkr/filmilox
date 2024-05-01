import Admin from './Admin';
import {
    fireEvent,
    getByText,
    render,
    screen,
    waitFor,
} from '../../utils/test-utils';
import { debug } from 'console';
import userEvent from '@testing-library/user-event';

describe('Test Admin component', () => {
    test('Tests if all necessary inputs/buttons (UI) are present.', () => {
        const { getByTestId } = render(<Admin />);

        const heading = getByTestId('heading');
        expect(heading).toBeInTheDocument();

        const titleInput = getByTestId('titleInput');
        expect(titleInput).toHaveTextContent('Title');

        const descriptionInput = getByTestId('descriptionInput');
        expect(descriptionInput).toHaveTextContent('Description');

        const dateInput = getByTestId('datePicker');
        expect(dateInput).toHaveTextContent('Release date');

        const trailerInput = getByTestId('linkInput');
        expect(trailerInput).toHaveTextContent('Trailer-Link');

        const addImgBtn = getByTestId('addImgButton');
        expect(addImgBtn).toBeInTheDocument();

        const addMovieBtn = getByTestId('addMovieBtn');
        expect(addMovieBtn).toBeInTheDocument();

        const cancelBtn = getByTestId('cancelBtn');
        expect(cancelBtn).toBeInTheDocument();
    });

    test('Tests validation with empty inputs.', () => {
        const { getByTestId } = render(<Admin />);

        const addMovieBtn = getByTestId('addMovieBtn');
        const titleInput = getByTestId('titleInput').querySelector('div');
        const descriptionInput =
            getByTestId('descriptionInput').querySelector('div');
        const linkInput = getByTestId('linkInput').querySelector('div');

        fireEvent.click(addMovieBtn);

        expect(titleInput?.querySelector('input')).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(titleInput).toHaveClass('Mui-error');

        expect(descriptionInput?.querySelector('textarea')).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(descriptionInput).toHaveClass('Mui-error');

        expect(linkInput?.querySelector('input')).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(linkInput).toHaveClass('Mui-error');
    });

    test('Tests adding movie', async () => {
        const { getByTestId } = render(<Admin />);

        const addMovieBtn = getByTestId('addMovieBtn');
        const titleInput =
            getByTestId('titleInput').querySelector('div')?.firstChild;
        const descriptionInput =
            getByTestId('descriptionInput').querySelector('div')?.firstChild;
        const linkInput =
            getByTestId('linkInput').querySelector('div')?.firstChild;

        await userEvent.type(titleInput as HTMLInputElement, 'TitelBeispiel');
        await userEvent.type(
            descriptionInput as HTMLInputElement,
            'BeschreibungBeispiel'
        );
        await userEvent.type(linkInput as HTMLInputElement, 'LinkBeispiel');

        expect(titleInput).toHaveValue('TitelBeispiel');
        expect(descriptionInput).toHaveValue('BeschreibungBeispiel');
        expect(linkInput).toHaveValue('LinkBeispiel');

        await userEvent.click(addMovieBtn);
    });

    test('Tests image validation', async () => {
        const { getByTestId } = render(<Admin />);

        const uploadImage = getByTestId('addImgInput');
        expect(uploadImage).toHaveAttribute('accept', 'image/*');

        const file = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
        });
        await waitFor(() =>
            fireEvent.change(uploadImage, {
                target: { files: [file] },
            })
        );

        // fehlt: testen der validierung
        //const imgErr = getByTestId('ImgSizeErr');
        //expect(imgErr).toBeInTheDocument();
    });
});
