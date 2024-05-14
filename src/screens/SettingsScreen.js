import React, { useState } from "react";
import Box from "@mui/material/Box";
import { db } from "../firebaseConfig";
import Avatar from "avataaars";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import { setSettingsExpanded, setDarkMode, setTheme } from "../actions/actions";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateAccountScreen from "./CreateAccountScreen";
import PasswordReset from "../components/PasswordReset";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function SettingsScreen(props) {
  const dispatch = useDispatch();
  const screenState = useSelector((state) => state.screenState);
  const theme = useSelector((state) => state.theme);
  const settingsExpanded = useSelector((state) => state.settingsExpanded);
  const activeUser = useSelector((state) => state.activeUser);
  const darkMode = useSelector((state) => state.darkMode);
  const [isHovered, setIsHovered] = useState(null);

  const handleHover = (x) => {
    setIsHovered(x);
  };

  const handleChange = (panel) => (event, issettingsExpanded) => {
    setSettingsExpanded(issettingsExpanded ? panel : false);
  };

  const handleChangeTheme = (x) => {
    dispatch(setTheme(x));
    db.collection("Users").doc(activeUser.docId).update({ theme: x });
  };

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
    setTimeout(() => {
      db.collection("Users")
        .doc(activeUser.docId)
        .update({ darkMode: !darkMode });
    }, 500);
  };

  const availableThemes = {
    "Veridian Disco": {
      primary: "#19535F",
      secondary: "#88B2B8",
      tertiary: "#A9BCD0",
      light: "#D8DBE2",
      lighter: "#fff",
      grey: "#393E41",
      dark: "#3c3f3c",
      darker: "#1B1B1E",
    },
    "Currant Event": {
      primary: "#680C07",
      secondary: "#D64933",
      tertiary: "#F16E5A",
      light: "#EBEBEB",
      lighter: "#fff",
      grey: "#656565",
      dark: "#332e2e",
      darker: "#1B1B1E",
    },
    "Possibly Pumpkin": {
      primary: "#D56012",
      secondary: "#E77F0F",
      tertiary: "#D68B11",
      light: "#FFF1DE",
      lighter: "#fff",
      grey: "#908D8D",
      dark: "#3c3f3c",
      darker: "#1B1B1E",
    },
    "Cerulean Tango": {
      primary: "#007090",
      secondary: "#01A7C2",
      tertiary: "#A3BAC3",
      light: "#EAEBED",
      lighter: "#fff",
      grey: "#393E41",
      dark: "#2C3133",
      darker: "#1B1B1E",
    },
    "Midnight Merlot": {
      primary: "#5C415D",
      secondary: "#694966",
      tertiary: "#74526C",
      light: "#FBF3FF",
      lighter: "#fff",
      grey: "#393E41",
      dark: "#29242A",
      darker: "#1B1B1E",
    },
    "Sapphire Spectrum": {
      primary: "#23395B",
      secondary: "#406E8E",
      tertiary: "#8EA8C3",
      light: "#EFFDFF",
      lighter: "#fff",
      grey: "#393E41",
      dark: "#21273f",
      darker: "#111216",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        "& > :not(style)": {
          width: "100vw",
          minHeight: "calc(100vh - 70px)",
          position: "absolute",
          top: 70,
          left: 0,
          padding: "25px",
          maxWidth: "calc(100% - 50px)",
          backgroundColor: darkMode ? theme.darker : theme.light,
        },
      }}
    >
      <Slide
        direction="up"
        in={screenState === "SettingsScreen"}
        mountOnEnter
        unmountOnExit
      >
        <div
          style={props.mobile ? {} : { display: "flex", flexDirection: "row" }}
        >
          <div
            style={
              props.mobile
                ? {}
                : { display: "flex", flexDirection: "column", flex: "1" }
            }
          >
            <Box
              component="section"
              sx={{
                backgroundColor: "#fff",
                color: darkMode && theme.lighter,
                margin: "0px 0px 16px 0px",
                padding: "12px",
                borderRadius: "4px",
                boxShadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
                overflowAnchor: "none",
                borderRadius: 0,
                backgroundColor: darkMode ? theme.dark : theme.lighter,
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                  }}
                >
                  <Avatar
                    style={{
                      width: "100%",
                      maxWidth: props.mobile ? "100px" : "125px",
                      maxHeight: props.mobile ? "100px" : "125px",
                    }}
                    avatarStyle="Circle"
                    {...activeUser.avatar}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "50%",
                  }}
                >
                  {activeUser.firstName !== "" && (
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "20px",
                        color: darkMode ? theme.light : theme.primary,
                      }}
                    >
                      {activeUser.firstName.charAt(0).toUpperCase() +
                        activeUser.firstName.slice(1) +
                        " " +
                        activeUser.lastName.charAt(0).toUpperCase() +
                        activeUser.lastName.slice(1)}
                    </div>
                  )}
                  <div
                    style={{ color: theme.grey.text, wordBreak: "break-all" }}
                  >
                    {activeUser.email}
                  </div>
                </div>
              </div>
            </Box>
            <Accordion
              defaultExpanded
              style={{
                backgroundColor: darkMode ? theme.dark : theme.lighter,
                color: darkMode && theme.lighter,
              }}
              settingsExpanded={settingsExpanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography
                  sx={{
                    color: darkMode ? theme.light : theme.primary,
                    fontWeight: 700,
                  }}
                >
                  Personal Information
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CreateAccountScreen
                  theme={theme}
                  mobile={props.mobile}
                  environment={"setting"}
                />
              </AccordionDetails>
            </Accordion>
          </div>
          <div
            style={
              props.mobile
                ? { margin: "16px 0px" }
                : {
                    display: "flex",
                    flexDirection: "column",
                    flex: "1",
                    margin: "0px 16px",
                  }
            }
          >
            <Accordion
              defaultExpanded={props.mobile ? false : true}
              style={{
                backgroundColor: darkMode ? theme.dark : theme.lighter,
                color: darkMode && theme.lighter,
              }}
              settingsExpanded={settingsExpanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography
                  sx={{
                    color: darkMode ? theme.light : theme.primary,
                    fontWeight: 700,
                  }}
                >
                  Password Settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PasswordReset />
              </AccordionDetails>
            </Accordion>
          </div>
          <div
            style={
              props.mobile
                ? {}
                : { display: "flex", flexDirection: "column", flex: "1" }
            }
          >
            <Accordion
              defaultExpanded={props.mobile ? false : true}
              style={{
                backgroundColor: darkMode ? theme.dark : theme.lighter,
                color: darkMode && theme.lighter,
              }}
              settingsExpanded={settingsExpanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography
                  sx={{
                    color: darkMode ? theme.light : theme.primary,
                    fontWeight: 700,
                  }}
                >
                  Theme Settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                  value={darkMode}
                  control={
                    <Switch
                      color="secondary"
                      onChange={toggleDarkMode}
                      checked={darkMode ? true : false}
                    />
                  }
                  label={darkMode ? <Brightness4Icon /> : <DarkModeIcon />}
                  labelPlacement="start"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {Object.keys(availableThemes).map((themeName) => (
                    <div
                      style={{
                        margin: props.mobile ? "5px 0px" : "5px",
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "15px",
                        padding: "10px",
                        border:
                          theme.primary == availableThemes[themeName].primary ||
                          isHovered == availableThemes[themeName].primary
                            ? `3px solid ${theme.primary}`
                            : "3px solid transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => {
                        handleHover(availableThemes[themeName].primary);
                      }}
                      onMouseLeave={() => {
                        handleHover(null);
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          handleChangeTheme(availableThemes[themeName]);
                        }}
                      >
                        {Object.values(availableThemes[themeName]).map(
                          (color) => {
                            if (
                              color !== availableThemes[themeName].lighter &&
                              color !== availableThemes[themeName].darker &&
                              color !== availableThemes[themeName].grey
                            ) {
                              return (
                                <div
                                  style={{
                                    backgroundColor: color,
                                    width: "25px",
                                    height: "25px",
                                    margin: "5px",
                                  }}
                                ></div>
                              );
                            } else {
                              return null;
                            }
                          }
                        )}
                      </div>
                      {themeName}
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </Slide>
    </Box>
  );
}

export default SettingsScreen;
