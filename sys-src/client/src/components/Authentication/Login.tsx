import { Button, TextField } from '@mui/material';
import PasswordInput from '../inputs/PasswordInput';
import { ChangeEvent, useState } from 'react';
import Backend from '../../api/Backend';
import { useAppDispatch } from '../../redux/hooks';
import { fetchUserData } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { IResponseError } from '../../model/IResponseError';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState<string>('');
    const [identifierError, setIdentifierError] = useState({
        status: false,
        message: '',
    });
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState({
        status: false,
        message: '',
    });

    const handleIdentifierChange = (event: ChangeEvent<HTMLInputElement>) =>
        setIdentifier(event.target.value);

    const handleLogin = async () => {
        try {
            await Backend.login({ password, identifier });
            dispatch(await fetchUserData());
            navigate('/');
        } catch (e: any) {
            if (e.response) {
                const data = e.response?.data as IResponseError;

                const identifierError = data.errors.find(
                    (item) => item.param === 'identifier'
                );
                if (identifierError) {
                    setIdentifierError({
                        status: true,
                        message: identifierError.message,
                    });
                }

                const passwordError = data.errors.find(
                    (item) => item.param === 'password'
                );
                if (passwordError) {
                    setPasswordError({
                        status: true,
                        message: passwordError.message,
                    });
                }

                const internalError = data.errors.find(
                    (item) => item.param === 'internal'
                );
                if (internalError) {
                    alert(internalError.message);
                }
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center max-w-sm w-full px-6">
                <h1
                    className="font-bold text-4xl mt-8"
                    data-testid="login-text"
                >
                    Login
                </h1>
                <TextField
                    error={identifierError.status}
                    helperText={identifierError.message}
                    fullWidth
                    label="Email / Username"
                    variant="filled"
                    sx={{ mt: 2 }}
                    value={identifier}
                    onChange={handleIdentifierChange}
                />
                <PasswordInput
                    setValue={setPassword}
                    value={password}
                    error={passwordError.status}
                    helperText={passwordError.message}
                />
                <Button
                    data-testid="login-button"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Login;
