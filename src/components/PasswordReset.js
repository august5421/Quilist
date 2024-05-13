import React, { useState } from "react";
import { TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setChangePassword } from "../actions/actions";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import { db } from '../firebaseConfig';
import bcrypt from "bcryptjs";

const PasswordReset = (props) => {
  const dispatch = useDispatch();
  const changePassword = useSelector((state) => state.changePassword);
  const theme = useSelector((state) => state.theme);
  const activeUser = useSelector((state) => state.activeUser);
  const darkMode = useSelector((state) => state.darkMode);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleReset = async () => {
    const userRef = db.collection('Users').doc(activeUser.docId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const isPasswordCorrect = await bcrypt.compare(changePassword.currentPassword, userData.password);
      if (isPasswordCorrect) {
        if (changePassword.newPassword == changePassword.confirmPassword) {
            const hashedNewPassword = await bcrypt.hash(changePassword.newPassword, 10);
            await userRef.update({
            password: hashedNewPassword
            });
            setShowCurrentPassword(false)
            setShowNewPassword(false)
            dispatch(setChangePassword('success', 'Password reset successfully.'));
            dispatch(setChangePassword('currentPassword', ''));
            dispatch(setChangePassword('newPassword', ''));
            dispatch(setChangePassword('confirmPassword', ''));
        } else {
          dispatch(setChangePassword('error', 'Passwords do not match.'));
        }
      } else {
        dispatch(setChangePassword('error', 'Incorrect current password. Please try again.'));
      }
    } else {
      dispatch(setChangePassword('error', 'User not found. Please try again.'));
    }
  };

  return (
    <div>
      
      <TextField
        label="Current Password"
        color="secondary"
        focused={darkMode && true}
        type={showCurrentPassword ? "text" : "password"}
        id={darkMode ? 'filled-basic' :  'outlined-basic'}
        value={changePassword.currentPassword}
        size='small'
        onChange={(e) => {
            dispatch(setChangePassword('currentPassword', e.target.value));
        }}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleCurrentPasswordVisibility}
                edge="end"
              >
                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="New Password"
        color="secondary"
        focused={darkMode && true}
        type={showNewPassword ? "text" : "password"}
        id={darkMode ? 'filled-basic' :  'outlined-basic'}
        value={changePassword.newPassword}
        size='small'
        onChange={(e) => {
            dispatch(setChangePassword('newPassword', e.target.value));
        }}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleNewPasswordVisibility}
                edge="end"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm New Password"
        color="secondary"
        focused={darkMode && true}
        type={showNewPassword ? "text" : "password"}
        id={darkMode ? 'filled-basic' :  'outlined-basic'}
        value={changePassword.confirmPassword}
        size='small'
        onChange={(e) => {
            dispatch(setChangePassword('confirmPassword', e.target.value));
        }}
        fullWidth
        margin="normal"
      />
      {changePassword.error && (
        <Fade in>
          <Alert style={{ marginTop: "10px" }} severity="error">
            {changePassword.error}
          </Alert>
        </Fade>
      )}
      {changePassword.success && (
        <Fade in>
          <Alert style={{ marginTop: "10px" }} severity="success">
            {changePassword.success}
          </Alert>
        </Fade>
      )}
      <Button
        variant="contained"
        style={{
            backgroundColor: theme.primary,
            margin: "15px 0px",
            width: '100%',
        }}
        onClick={handleReset}
      >
        Reset Password
      </Button>
    </div>
  );
};

export default PasswordReset;
