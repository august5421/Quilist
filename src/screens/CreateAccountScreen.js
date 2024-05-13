import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { setScreenState, setActiveUser, setTheme, setUserFriends, setShowAvatarEditor } from "../actions/actions";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Avatar from "avataaars";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { generateRandomAvatarOptions } from "../components/randomizeAvatar";
import { db } from '../firebaseConfig';
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import bcrypt from "bcryptjs";
import Collapse from '@mui/material/Collapse';
import BuildAvatar from '../components/BuildAvatar'

function CreateAccountScreen(props) {
  const screenState = useSelector((state) => state.screenState);
  const theme = useSelector((state) => state.theme);
  const darkMode = useSelector((state) => state.darkMode);
  const activeUser = useSelector((state) => state.activeUser);
  const showAvatarEditor = useSelector((state) => state.showAvatarEditor);
  const initAvatarCustomizer = useSelector((state) => state.initAvatarCustomizer)
  const dispatch = useDispatch();
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [previousAvatars, setPreviousAvatars] = useState(
    props.environment == "setting"
      ? [activeUser.avatar]
      : [generateRandomAvatarOptions()]
  );
  const [formData, setFormData] = useState({
    firstName: props.environment == "setting" ? activeUser.firstName : "",
    lastName: props.environment == "setting" ? activeUser.lastName : "",
    email: props.environment == "setting" ? activeUser.email : "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const containerRef = useRef(null);

  const handleCreateAccountClick = () => {
    dispatch(setScreenState(null));
    setTimeout(() => {
      dispatch(setScreenState("LogIn"));
      setPreviousAvatars([generateRandomAvatarOptions()]);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        errors: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      });
    }, 500);
  };

  const handleNextAvatar = () => {
    if (currentAvatarIndex < previousAvatars.length - 1) {
      setCurrentAvatarIndex(currentAvatarIndex + 1);
      setSuccessfulUpdate(false)
    } else {
      const newAvatar = generateRandomAvatarOptions();
      setPreviousAvatars([...previousAvatars, newAvatar]);
      setCurrentAvatarIndex(currentAvatarIndex + 1);
      setSuccessfulUpdate(false)
    }
  };

  const handlePreviousAvatar = () => {
    if (currentAvatarIndex > 0) {
      setCurrentAvatarIndex(currentAvatarIndex - 1);
      setSuccessfulUpdate(false)
    }
  };
  
  const handleToggleAvatar = () => {
    dispatch(setShowAvatarEditor(!showAvatarEditor));
  }

  const searchUserByEmail = async (email) => {
    try {
      const querySnapshot = await db.collection("Users").where("email", "==", email).get();
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error searching for user:", error);
      return false;
    }
  };

  const handleCreateAccount = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim()) {
      errors.firstName = "Please enter your first name.";
    }

    if (!lastName.trim()) {
      errors.lastName = "Please enter your last name.";
    }

    
    if (!email.trim() || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    

    if (props.environment !== "setting") {
      if (!password.trim()) {
        errors.password = "Please enter a password.";
      }
    }

    if (props.environment !== "setting") {
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }
    
    const emailExists = await searchUserByEmail(email);
    if (emailExists && props.environment !== "setting") {
      errors.email = "Email address already exists.";
    }

    const emailModified = activeUser.email !== email;

    if (emailModified) {
      const emailExists = await searchUserByEmail(email);
      if (emailExists) {
        errors.email = "Email address already exists.";
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      errors,
    }));

    if (Object.keys(errors).length === 0) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error("Error hashing password: ", err);
        } else {
          db.collection("Users")
            .where("email", "==", formData.email)
            .get()
            .then((querySnapshot) => {
              if (Object.keys(errors).length === 0) {
                if (props.environment === "setting") {
                  const updatedFields = {
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                    avatar: showAvatarEditor == false ? previousAvatars[currentAvatarIndex] : initAvatarCustomizer,
                  };
                  if (emailModified) {
                    updatedFields.email = email;
                  }
                  db.collection("Users")
                    .doc(activeUser.docId)
                    .update(updatedFields)
                    .then(() => {
                      setSuccessfulUpdate(true);
                      dispatch(setActiveUser({
                        firstName: firstName.toLowerCase(),
                        lastName: lastName.toLowerCase(),
                        email: emailModified ? email : activeUser.email,
                        avatar: showAvatarEditor == false ? previousAvatars[currentAvatarIndex] : initAvatarCustomizer,
                        docId: activeUser.docId,
                        theme: theme,
                        freids: activeUser.friends
                      }));
                    })
                    .catch((error) => {
                      console.error("Error updating user in Firestore: ", error);
                    });
                } else {
                  bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                      console.error("Error hashing password: ", err);
                    } else {
                      db.collection("Users")
                        .add({
                          firstName: firstName.toLowerCase(),
                          lastName: lastName.toLowerCase(),
                          email: email,
                          avatar: previousAvatars[currentAvatarIndex],
                          password: hash,
                          theme: theme,
                          darkMode: darkMode,
                          friends: [{
                            "requestingUserId": "lVkLv65DuVWxLTFktt7R",
                            "friendLastName": "bot",
                            "status": "accepted",
                            "friendDocId": "WpfMAzGK1QpQCqjoPqML",
                            "friendFirstName": "quilist",
                            "friendAvatar": {
                                "hairColor": "Blonde",
                                "topType": "NoHair",
                                "eyebrowType": "DefaultNatural",
                                "accessoriesType": "Wayfarers",
                                "skinColor": "Pale",
                                "eyeType": "Close",
                                "facialHairType": "Blank",
                                "clotheColor": "Black",
                                "mouthType": "Serious",
                                "clotheType": "CollarSweater",
                                "graphicType": "Bat",
                                "hatColor": "BrownDark",
                                "facialHairColor": "Blank"
                            }
                        }]
                        })
                        .then((docRef) => {
                          const docId = docRef.id;
                          db.collection("Users")
                            .doc(docId)
                            .update({ docId: docId })
                            .then(() => {
                              setTimeout(() => {
                                db.collection("Users")
                                  .where("email", "==", email)
                                  .get()
                                  .then((querySnapshot) => {
                                    if (!querySnapshot.empty) {
                                      querySnapshot.forEach((doc) => {
                                        const userData = doc.data();
                                        Cookies.set(
                                          "user",
                                          JSON.stringify(userData)
                                        );
                                      });
                                    }
                                  }, 500);
                                dispatch(setScreenState(null));
                                dispatch(setUserFriends([{
                                  "requestingUserId": "lVkLv65DuVWxLTFktt7R",
                                  "friendLastName": "bot",
                                  "status": "accepted",
                                  "friendDocId": "WpfMAzGK1QpQCqjoPqML",
                                  "friendFirstName": "quilist",
                                  "friendAvatar": {
                                      "hairColor": "Blonde",
                                      "topType": "NoHair",
                                      "eyebrowType": "DefaultNatural",
                                      "accessoriesType": "Wayfarers",
                                      "skinColor": "Pale",
                                      "eyeType": "Close",
                                      "facialHairType": "Blank",
                                      "clotheColor": "Black",
                                      "mouthType": "Serious",
                                      "clotheType": "CollarSweater",
                                      "graphicType": "Bat",
                                      "hatColor": "BrownDark",
                                      "facialHairColor": "Blank"
                                  }
                              }]));
                                dispatch(
                                  setActiveUser({
                                    firstName: firstName.toLowerCase(),
                                    lastName: lastName.toLowerCase(),
                                    email: email,
                                    avatar: previousAvatars[currentAvatarIndex],
                                    docId: docId,
                                    theme: theme,
                                    darkMode: darkMode,
                                    friends: [{
                                      "requestingUserId": "lVkLv65DuVWxLTFktt7R",
                                      "friendLastName": "bot",
                                      "status": "accepted",
                                      "friendDocId": "WpfMAzGK1QpQCqjoPqML",
                                      "friendFirstName": "quilist",
                                      "friendAvatar": {
                                          "hairColor": "Blonde",
                                          "topType": "NoHair",
                                          "eyebrowType": "DefaultNatural",
                                          "accessoriesType": "Wayfarers",
                                          "skinColor": "Pale",
                                          "eyeType": "Close",
                                          "facialHairType": "Blank",
                                          "clotheColor": "Black",
                                          "mouthType": "Serious",
                                          "clotheType": "CollarSweater",
                                          "graphicType": "Bat",
                                          "hatColor": "BrownDark",
                                          "facialHairColor": "Blank"
                                      }
                                  }]
                                  })
                                );
                                setTimeout(() => {
                                  dispatch(setScreenState("Dashboard"));
                                  setFormData({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    password: "",
                                    confirmPassword: "",
                                    errors: {
                                      firstName: "",
                                      lastName: "",
                                      email: "",
                                      password: "",
                                      confirmPassword: "",
                                    },
                                  });
                                }, 500);
                              });
                            })
                            .catch((error) => {
                              console.error(
                                "Error updating user record: ",
                                error
                              );
                            });
                        })
                        .catch((error) => {
                          console.error(
                            "Error adding user to Firestore: ",
                            error
                          );
                        });
                    }
                  });
                }
              }
            })
            .catch((error) => {
              console.error("Error getting documents:", error);
            });

          setFormData((prevState) => ({
            ...prevState,
            errors,
          }));
        }
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSuccessfulUpdate(false);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  return (
    <div>
      <Box
        ref={props.environment == "setting" ? containerRef : null}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          "& > :not(style)": {
            width: props.mobile ? "75vw" : "550px",
            padding: "25px",
          },
        }}
      >
        <Slide
          direction={props.environment == "setting" ? "up" : "right"}
          in={screenState === "CreateAccount" || props.environment == "setting"}
          container={props.environment == "setting" ? containerRef.current : null}
          mountOnEnter
          unmountOnExit
        >
          <Paper
            elevation={6}
            style={{
              display: "flex",
              flexDirection: "column",
              width: props.environment == "setting" ? "100%" : null,
              padding: props.environment == "setting" ? "0px" : null,
              boxShadow: props.environment == "setting" ? "unset" : null,
              backgroundColor: darkMode && props.environment == "setting" ? theme.dark : theme.lighter,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                position: 'relative',
              }}
            >
              {showAvatarEditor == false && (
                <ArrowCircleLeftIcon
                  fontSize="large"
                  sx={{
                    color: theme.primary,
                    width: "40px",
                    height: "40px",
                    opacity: currentAvatarIndex == 0 ? 0.5 : 1,
                  }}
                  onClick={handlePreviousAvatar}
                />
              )}
              <div className="casCont">
                {showAvatarEditor == false ? (
                  <Avatar
                    avatarStyle="Circle"
                    {...previousAvatars[currentAvatarIndex]}
                  />
                ) : (
                  <Avatar
                    avatarStyle='Circle'
                    {...initAvatarCustomizer}
                  />
                )}
              </div>
              {showAvatarEditor == false && (
                  <ArrowCircleRightIcon
                  sx={{
                    color: theme.primary,
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={handleNextAvatar}
                />
              )}
              {props.environment == "setting" && (
                <div style={{position: 'absolute', bottom: 0, right: 0,}}>
                  {showAvatarEditor == false ? (
                    <Button variant="text" onClick={handleToggleAvatar}>
                      Customize {props.mobile ? null : 'Avatar'}
                    </Button>
                  ) : (
                    <Button variant="text" onClick={handleToggleAvatar}>
                      Randomize Avatar
                    </Button>
                  )}
                </div>
              )}
            </div>
            <Box>
              <Collapse in={showAvatarEditor}>
                  <BuildAvatar />
              </Collapse>
              <Collapse in={!showAvatarEditor}>
                <div style={{display: 'flex', flexDirection:'column'}}>
                  <TextField
                    label="First Name"
                    color={darkMode && "secondary"}
                    focused={props.environment == "setting" && darkMode && true}
                    style={{ display: props.environment == "setting" && showAvatarEditor == true && "none" }}
                    variant="outlined"
                    margin="normal"
                    size="small"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formData.errors.firstName}
                  />
                  <TextField
                    label="Last Name"
                    color={darkMode && "secondary"}
                    focused={props.environment == "setting" && darkMode && true}
                    style={{ display: props.environment == "setting" && showAvatarEditor == true && "none" }}
                    variant="outlined"
                    margin="normal"
                    size="small"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formData.errors.lastName}
                  />
                  <TextField
                    label="Email"
                    color={darkMode && "secondary"}
                    focused={props.environment == "setting" && darkMode && true}
                    style={{ display: props.environment == "setting" && showAvatarEditor == true && "none" }}
                    variant="outlined"
                    margin="normal"
                    size="small"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formData.errors.email}
                  />
                </div>
              </Collapse>
            </Box>
            <TextField
              label="Password"
              type={formData.showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              size="small"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!formData.errors.password}
              style={{ display: props.environment == "setting" && "none" }}
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
            <TextField
              label="Confirm Password"
              type={formData.showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              size="small"
              name="confirmPassword"
              style={{ display: props.environment == "setting" && "none" }}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formData.errors.confirmPassword}
            />
            {!!Object.values(formData.errors).some((error) => !!error) && (
              <Fade in>
                <Alert style={{ marginTop: "10px" }} severity="error">
                  {Object.values(formData.errors).map((error, index) => (
                    <span key={index}>{error} </span>
                  ))}
                </Alert>
              </Fade>
            )}
            {successfulUpdate && (
              <Fade in>
                <Alert style={{ marginTop: "10px" }} severity="success">
                  The user was successfully updated
                </Alert>
              </Fade>
            )}
            <Button
              variant="contained"
              style={{
                backgroundColor: theme.primary,
                margin: "15px 0px",
              }}
              onClick={handleCreateAccount}
            >
              {props.environment == "setting" ? (
                <div>Update Account</div>
              ) : (
                <div>Create Account</div>
              )}
            </Button>
            {props.environment !== "setting" && (
              <div
                style={{
                  color: props.theme.primary,
                  textAlign: "center",
                }}
              >
                <Button variant="text" onClick={handleCreateAccountClick}>
                  Log In
                </Button>
              </div>
            )}
          </Paper>
        </Slide>
      </Box>
    </div>
  );
}

export default CreateAccountScreen;
