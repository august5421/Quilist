import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { setActiveUser, setScreenState, setTheme, setDarkMode, setUserFriends } from '../actions/actions';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import { db } from '../firebaseConfig';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import bcrypt from 'bcryptjs';

function LoginScreen(props) {
  const screenState = useSelector(state => state.screenState);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    errors: {
      email: '',
      password: ''
    }
  });

  const handleCreateAccountClick = () => {
    dispatch(setScreenState(null));
    setTimeout(() => {
      dispatch(setScreenState('CreateAccount'));
      setFormData({
        email: '',
        password: '',
        errors: {
          email: '',
          password: ''
        }
      })
    }, 500);
  };

  const handleLogin = () => {
    const { email, password } = formData;
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
      errors.password = 'Please enter your password.';
    }
    setFormData(prevState => ({
      ...prevState,
      errors
    }));
    if (Object.keys(errors).length === 0) {
      db.collection('Users')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            setFormData(prevState => ({
              ...prevState,
              errors: {
                email: 'Incorrect email or password.'
              }
            }));
          } else {
            querySnapshot.forEach(doc => {
              const userData = doc.data();
              bcrypt.compare(password, userData.password, (err, result) => {
                if (err) {
                  console.error("Error comparing passwords: ", err);
                  return;
                }
                if (result) {
                  Cookies.set('user', JSON.stringify(userData));
                  dispatch(setActiveUser({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    avatar: userData.avatar,
                    docId: userData.docId,
                    theme: userData.theme,
                    friends: userData.friends
                  }));
                  dispatch(setTheme(userData.theme))
                  dispatch(setDarkMode(userData.darkMode));
                  dispatch(setUserFriends(userData.friends));
                  dispatch(setScreenState(null));
                  setTimeout(() => {
                    dispatch(setScreenState('Dashboard'));
                    setFormData({
                      email: '',
                      password: '',
                      errors: {
                        email: '',
                        password: ''
                      }
                    })
                  }, 500)
                } else {
                  setFormData(prevState => ({
                    ...prevState,
                    errors: {
                      password: 'Incorrect password.'
                    }
                  }));
                }
              });
            });
          }
        })
        .catch(error => {
          console.error("Error searching for user: ", error);
        });
    }    
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: ''
      }
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        '& > :not(style)': {
          width: props.mobile ? '75vw' : '550px',
          padding: '25px',
          maxWidth: 'calc(100% - 50px)',
        },
      }}
    >
      <Slide direction="left" in={screenState === 'LogIn'} mountOnEnter unmountOnExit>
        <Paper elevation={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            size="small"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formData.errors.email}
          />
          <TextField
            label="Password"
            type={formData.showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            size="small"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!formData.errors.password}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      showPassword: !prevData.showPassword,
                    }))
                  }
                  edge="end"
                >
                  {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          
            {!!formData.errors.email || !!formData.errors.password ? (
                <Fade in={!!formData.errors.email || !!formData.errors.password}>
                    <Alert style={{marginTop: '10px'}} severity="error">{formData.errors.email !== undefined && formData.errors.email + ' '}{formData.errors.password !== undefined && formData.errors.password}</Alert>
                </Fade>
            ) : null}
          
          <Button
            variant="contained"
            style={{ backgroundColor: theme.primary, margin: '15px 0px' }}
            onClick={handleLogin}
          >
            Log In
          </Button>
          <div style={{ color: theme.primary, textAlign: 'center' }}>
            <Button variant="text" onClick={handleCreateAccountClick}>
              Create An Account
            </Button>
          </div>
        </Paper>
      </Slide>
    </Box>
  );
}

export default LoginScreen;
