import { render } from '../../utils/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import Registration from './Registration';
import axios from 'axios';
import ApiRouter from '../../api/ApiRouter';
import { act } from 'react-dom/test-utils';

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
    const utils = render(<Registration />);
    const emailInput = utils.getByLabelText('E-mail') as HTMLInputElement;
    const passwordInput = utils.getByLabelText('Password') as HTMLInputElement;
    const userNameInput = utils.getByLabelText('Username') as HTMLInputElement;
    const submitButton = utils.getByTestId('registration-button');
    return {
        emailInput,
        passwordInput,
        userNameInput,
        submitButton,
        ...utils,
    };
};

test('It should change the email username password input', async () => {
    const {
        emailInput,
        passwordInput,
        userNameInput,
        getByText,
        submitButton,
    } = setup();

    expect(getByText(/Register/i, { selector: 'h1' })).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    expect(emailInput).toHaveClass('MuiFilledInput-input');
    expect(passwordInput).toHaveClass('MuiFilledInput-input');
    expect(userNameInput).toHaveClass('MuiFilledInput-input');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput.value).toBe('test@test.com');

    fireEvent.change(passwordInput, { target: { value: 'password1234' } });
    expect(passwordInput.value).toBe('password1234');

    fireEvent.change(userNameInput, { target: { value: 'username' } });
    expect(userNameInput.value).toBe('username');

    // Provide the data object to be returned from the server
    mockedAxios.post.mockResolvedValue({
        data: { token: 'testToken' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(ApiRouter.Register, {
            email: 'test@test.com',
            username: 'username',
            password: 'password1234',
        });
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);
    });
});

test('Error Handling', async () => {
    const { emailInput, passwordInput, userNameInput, submitButton } = setup();

    fireEvent.click(submitButton);

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput.value).toBe('test@test.com');

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    expect(passwordInput.value).toBe('password');

    fireEvent.change(userNameInput, { target: { value: 'username' } });
    expect(userNameInput.value).toBe('username');

    // Provide the data object to be returned from the server
    mockedAxios.post.mockImplementation(() => {
        return Promise.reject({
            response: {
                data: {
                    errors: [
                        {
                            param: 'password',
                            message: 'Invalid password',
                        },
                    ],
                },
            },
        });
    });

    await act(() => {
        fireEvent.click(submitButton);
    });

    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);
    });
});
