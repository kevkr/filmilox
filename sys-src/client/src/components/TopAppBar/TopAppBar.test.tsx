import { render } from '../../utils/test-utils';
import TopAppBar from './TopAppBar';
import { fireEvent } from '@testing-library/react';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate,
}));

describe('Test TopAppBar component', () => {
    test('Test if everything is rendered successfully', () => {
        const { getByTestId } = render(<TopAppBar />);

        const logo = getByTestId('logo');
        const brandText = getByTestId('brand-text');
        const search = getByTestId('search');
        const loginBtn = getByTestId('loginBtn');
        const registerBtn = getByTestId('registerBtn');

        expect(logo).toBeInTheDocument();
        expect(brandText).toBeInTheDocument();
        expect(search).toBeInTheDocument();
        expect(loginBtn).toBeInTheDocument();
        expect(registerBtn).toBeInTheDocument();

        expect(brandText).toHaveTextContent('Filmilox');
        expect(logo).toHaveAttribute('src', 'logo.png');
        expect(loginBtn).toHaveTextContent('Login');
        expect(registerBtn).toHaveTextContent('Register');

        fireEvent.click(loginBtn);
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('login');

        fireEvent.click(registerBtn);
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(2);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('register');
    });
});
