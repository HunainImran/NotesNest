import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import human3 from '../assets/human-3.svg';
import human2 from '../assets/human-2.svg';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Ensure the Poppins font is loaded

// Custom theme with Poppins font
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
        },
      },
    },
  },
});

export default function SignInSide() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: 'relative',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              textAlign: 'center',
              color: 'black',
              zIndex: 1,
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 20 }}>
              Simplify your life, one note at a time
            </Typography>
          </Box>
          <Box
            component="img"
            src={human3}
            alt="human looking left"
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              height: '40%',
            }}
          />
          <Box
            component="img"
            src={human2}
            alt="human looking right"
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              height: '40%',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#12296C' }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
