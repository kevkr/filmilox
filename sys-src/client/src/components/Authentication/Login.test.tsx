import { render, fireEvent } from '../../utils/test-utils';
import Login from './Login';
import axios from 'axios';
import { waitFor } from '@testing-library/react';
import ApiRouter from '../../api/ApiRouter';

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockedUsedNavigate,
}));

const setup = () => {
    const utils = render(<Login />);
    const emailInput = utils.getByLabelText(
        'Email / Username'
    ) as HTMLInputElement;
    const passwordInput = utils.getByLabelText('Password') as HTMLInputElement;
    const submitButton = utils.getByTestId('login-button');
    const loginText = utils.getByTestId('login-text');
    return {
        emailInput,
        passwordInput,
        submitButton,
        loginText,
        ...utils,
    };
};

describe('login', () => {
    test('It should check if everything is rendered and change the email, password', async () => {
        const { emailInput, passwordInput, submitButton, loginText } = setup();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(loginText).toBeInTheDocument();

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
        expect(emailInput).toHaveClass('MuiFilledInput-input');
        expect(passwordInput).toHaveClass('MuiFilledInput-input');

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        expect(emailInput.value).toBe('test@test.com');

        fireEvent.change(passwordInput, { target: { value: 'password1234' } });
        expect(passwordInput.value).toBe('password1234');

        // Provide the data object to be returned from the server
        mockedAxios.post.mockResolvedValue({
            data: { token: 'testToken' },
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(2);
            expect(mockedAxios.post).toHaveBeenCalledWith(ApiRouter.Login, {
                identifier: 'test@test.com',
                password: 'password1234',
            });

            expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('It should check if everything is rendered and change the email, password', async () => {
        const { emailInput, passwordInput, submitButton, loginText } = setup();
        fireEvent.change(emailInput, { target: { value: 'test@fake.com' } });
        expect(emailInput.value).toBe('test@fake.com');

        fireEvent.change(passwordInput, { target: { value: 'password' } });
        expect(passwordInput.value).toBe('password');

        // Provide the data object to be returned from the server
        mockedAxios.post.mockImplementation(() => {
            return Promise.reject({
                response: {
                    data: {
                        errors: [
                            {
                                param: 'fake param',
                                msg: 'Invalid email or password',
                            },
                        ],
                    },
                },
            });
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);
        });
    });
});
