import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { store } from '../redux/store';
import theme from '../Theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <BrowserRouter>{children}</BrowserRouter>
                </LocalizationProvider>
            </ThemeProvider>
        </Provider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
