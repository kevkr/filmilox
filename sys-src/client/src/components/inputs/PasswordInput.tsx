import { ChangeEvent, MouseEvent, useState } from 'react';
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    FilledInput,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface IProps {
    value: string;
    setValue: (value: string) => void;
    error?: boolean;
    helperText?: string;
}

const PasswordInput = ({ value, setValue, helperText, error }: IProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setValue(event.target.value);

    const handleClickShowPassword = () =>
        setShowPassword((showPassword) => !showPassword);
    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <FormControl variant="filled" fullWidth sx={{ mt: 1 }}>
            <InputLabel htmlFor="password" error={error}>
                Password
            </InputLabel>
            <FilledInput
                id="password"
                error={error}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={handleChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {helperText && (
                <p
                    style={{
                        color: '#f44336',
                        marginLeft: '14px',
                        marginRight: '14px',
                        fontSize: '0.75rem',
                        marginTop: '3px',
                        textAlign: 'left',
                        fontWeight: '400',
                        lineHeight: '1.66',
                        letterSpacing: '0.03333em',
                    }}
                >
                    {helperText}
                </p>
            )}
        </FormControl>
    );
};

export default PasswordInput;
