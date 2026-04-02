import { createTheme } from '@mui/material/styles';

const teslaTokens = {
  black: '#171717',
  gray: '#E3E3E3',
  blue: '#3E6AE1',
};

const theme = createTheme({
  palette: {
    primary: {
      main: teslaTokens.black,
    },
    secondary: {
      main: teslaTokens.blue,
    },
  },
  typography: {
    fontFamily: [
      '"Universal Sans Display"',
      '-apple-system',
      'Arial',
      'sans-serif',
    ].join(','),

    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      textTransform: 'none',
      color: teslaTokens.black,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      color: teslaTokens.black,
    },
    
    overline: {
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      color: '#5C5E62',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;