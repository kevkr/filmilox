import { Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface CustomTheme extends Theme {
        filmilox: {
            white: string;
        };
    }
    interface CustomThemeOptions extends ThemeOptions {
        filmilox?: {
            white?: string;
        };
    }
    export function createTheme(options?: CustomThemeOptions): CustomTheme;
}
