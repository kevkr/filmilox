import React, { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import PasswordInput from '../inputs/PasswordInput';
import Backend from '../../api/Backend';
import Controller from '../../controller/Controller';
import { useAppDispatch } from '../../redux/hooks';
import { fetchUserData } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { IResponseError } from '../../model/IResponseError';

const Registration = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState({
        status: false,
        message: '',
    });
    const [username, setUsername] = useState<string>('');
    const [usernameError, setUsernameError] = useState({
        status: false,
        message: '',
    });
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState({
        status: false,
        message: '',
    });

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
        setEmail(event.target.value);
    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) =>
        setUsername(event.target.value);

    const handleRegister = async () => {
        try {
            let error = false;
            if (!Controller.isEmail(email)) {
                error = true;
                setEmailError({ status: true, message: 'Incorrect Email' });
            } else {
                setEmailError({ status: false, message: '' });
            }

            if (!username) {
                error = true;
                setUsernameError({
                    status: true,
                    message: 'Username is required',
                });
            } else {
                setUsernameError({ status: false, message: '' });
            }

            if (password.length < 5) {
                error = true;
                setPasswordError({
                    status: true,
                    message: 'Password must contain min. 5 letters',
                });
            } else {
                setPasswordError({ status: false, message: '' });
            }
            if (error) return;

            // Get token from backend
            await Backend.register({
                email,
                username,
                password,
            });
            // if User successful registered, than login
            await Backend.login({
                identifier: email,
                password,
            });
            dispatch(await fetchUserData());
            navigate('/');

            // Log in User
        } catch (e: any) {
            if (e.response) {
                const data = e.response?.data as IResponseError;
                const emailError = data.errors.find(
                    (item) => item.param === 'email'
                );
                if (emailError) {
                    setEmailError({
                        status: true,
                        message: emailError.message,
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

                const usernameError = data.errors.find(
                    (item) => item.param === 'username'
                );
                if (usernameError) {
                    setUsernameError({
                        status: true,
                        message: usernameError.message,
                    });
                }
                const internalError = data.errors.find(
                    (item) => item.param === 'internal'
                );
                if (internalError) alert(internalError.message);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center max-w-sm w-full px-6">
                <h1 className="font-bold text-4xl mt-8">Register</h1>
                <TextField
                    fullWidth
                    label="E-mail"
                    variant="filled"
                    sx={{ mt: 2 }}
                    value={email}
                    error={emailError.status}
                    helperText={emailError.message}
                    onChange={handleEmailChange}
                />
                <TextField
                    fullWidth
                    error={usernameError.status}
                    helperText={usernameError.message}
                    label="Username"
                    variant="filled"
                    sx={{ mt: 1 }}
                    value={username}
                    onChange={handleUsernameChange}
                />
                <PasswordInput
                    setValue={setPassword}
                    value={password}
                    error={passwordError.status}
                    helperText={passwordError.message}
                />
                <Button
                    data-testid="registration-button"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleRegister}
                >
                    Register
                </Button>
            </div>
        </div>
    );
};

export default Registration;
