import React, { useEffect } from "react";
import Cookies from "js-cookie";
import {
  setActiveUser,
  setScreenState,
  setTheme,
  setUserCookie,
  setUserFriends,
  setDarkMode,
} from "./actions/actions";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LogoFont from "./components/LogoFont";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import DashboardScreen from "./screens/DashboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NavScreen from "./screens/NavScreen";
import Fade from "@mui/material/Fade";
import { db } from "./firebaseConfig";

function App() {
  const dispatch = useDispatch();
  const veryMobile = useMediaQuery("(max-width:500px)");
  const mobile = useMediaQuery("(max-width:900px)");
  const mobileHeightRefactor = useMediaQuery("(max-height:800px)");
  const screenState = useSelector((state) => state.screenState);
  const theme = useSelector((state) => state.theme);
  const activeUser = useSelector((state) => state.activeUser);
  const darkMode = useSelector((state) => state.darkMode);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      dispatch(setActiveUser(JSON.parse(userCookie)));
      dispatch(setScreenState("Dashboard"));
      const jsonCookie = JSON.parse(userCookie);
      if (jsonCookie) {
        db.collection("Users")
          .doc(jsonCookie.docId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              dispatch(setUserFriends(userData.friends));
              dispatch(setDarkMode(userData.darkMode));
            }
          })
          .catch((error) => {
            console.error("Error fetching document:", error);
          });
        dispatch(setTheme(jsonCookie.theme));
      }
    }
  }, [dispatch]);

  const MUItheme = createTheme({
    palette: {
      primary: {
        main: theme.primary,
      },
      secondary: {
        main: theme.tertiary,
      },
    },
  });

  return (
    <ThemeProvider theme={MUItheme}>
      <div
        className={darkMode ? "darkModeTis" : null}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.primary,
        }}
      >
        <Fade
          in={
            screenState === "LogIn" ||
            (screenState === "CreateAccount" && !mobileHeightRefactor) ||
            (screenState === null && activeUser.firstName == "")
          }
        >
          <div style={{ position: "absolute", top: 50 }}>
            <LogoFont text="Quilist" color={theme.light} fontSize="50px" />
          </div>
        </Fade>

        <LoginScreen theme={theme} mobile={mobile} />
        <CreateAccountScreen theme={theme} mobile={mobile} />
        <NavScreen theme={theme} mobile={mobile} />
        <DashboardScreen theme={theme} mobile={mobile} veryMobile={veryMobile}/>
        <SettingsScreen theme={theme} mobile={mobile} />
      </div>
    </ThemeProvider>
  );
}

export default App;
