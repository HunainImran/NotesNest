// src/themes/theme.ts
import { createTheme } from '@mui/material/styles';
import { colors } from './constants';

const customTheme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: {
      fontFamily: 'Poppins, sans-serif',
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
    },
    body1: {
      fontFamily: 'Poppins, sans-serif',
    },
    body2: {
      fontFamily: 'Poppins, sans-serif',
    },
    subtitle1: {
      fontFamily: 'Poppins, sans-serif',
    },
    subtitle2: {
      fontFamily: 'Poppins, sans-serif',
    },
    caption: {
      fontFamily: 'Poppins, sans-serif',
    },
    overline: {
      fontFamily: 'Poppins, sans-serif',
    },
  },
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          backgroundColor: colors.primary
        },
      },
    },
  },
});

export default customTheme;
