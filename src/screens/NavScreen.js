import * as React from "react";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Avatar from "avataaars";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { IconButton } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import LogoFont from "../components/LogoFont";
import {
  setScreenState,
  setActiveUser,
  setUserCookie,
  setShowAvatarEditor,
  resetListInfo,
  setRelativeListRole,
} from "../actions/actions";
import Cookies from "js-cookie";

export default function NavScreen() {
  const dispatch = useDispatch();
  const screenState = useSelector((state) => state.screenState);
  const theme = useSelector((state) => state.theme);
  const activeUser = useSelector((state) => state.activeUser);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (x) => {
    setAnchorEl(null);
    if (x !== null) {
      setTimeout(() => {
        dispatch(setScreenState(null));
      }, 100);
      setTimeout(() => {
        dispatch(setScreenState(x));
      }, 500);
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(setScreenState(null));
    dispatch(setShowAvatarEditor(false));
    dispatch(setRelativeListRole(null));
    dispatch(resetListInfo());
    dispatch(
      setActiveUser({
        firstName: "",
      })
    );
    Cookies.remove("user");
    dispatch(
      setActiveUser({
        firstName: "",
        userLnam: "",
        userEmail: "",
        avatar: {},
        friends: [],
      })
    );
    setTimeout(() => {
      dispatch(setScreenState("LogIn"));
    }, 500);
  };

  return (
    <Box
      sx={{
        height: 70,
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "calc(100vw - 20px)",
          margin: "0px 10px",
        }}
      >
        <Grow
          in={
            screenState !== "LogIn" &&
            screenState !== "CreateAccount" &&
            activeUser.firstName !== ""
          }
          style={{ transformOrigin: "0 0 0" }}
          {...(screenState === "Dashboard" ? { timeout: 1000 } : {})}
        >
          <div>
            <LogoFont text="Quilist" color={theme.light} fontSize="30px" />
          </div>
        </Grow>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Grow
            in={
              screenState !== "LogIn" &&
              screenState !== "CreateAccount" &&
              activeUser.firstName !== ""
            }
            style={{ transformOrigin: "0 0 0" }}
            {...(screenState === "Dashboard" ? { timeout: 2000 } : {})}
          >
            <div className="navatarCont">
              <IconButton onClick={handleClick} color="inherit">
                <Avatar avatarStyle="Circle" {...activeUser.avatar} />
              </IconButton>
            </div>
          </Grow>
        </div>
      </Box>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          handleClose(null);
        }}
      >
        <MenuItem
          style={{
            backgroundColor: screenState == "Dashboard" && theme.secondary,
            color: screenState == "Dashboard" && theme.light,
          }}
          onClick={() => {
            if (screenState !== "Dashboard") {
              handleClose("Dashboard");
            }
          }}
        >
          <ListItemIcon>
            <DashboardIcon
              fontSize="small"
              style={{ color: screenState == "Dashboard" && theme.light }}
            />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem
          style={{
            backgroundColor: screenState == "SettingsScreen" && theme.secondary,
            color: screenState == "SettingsScreen" && theme.light,
          }}
          onClick={() => {
            if (screenState !== "SettingsScreen") {
              handleClose("SettingsScreen");
            }
          }}
        >
          <ListItemIcon>
            <Settings
              fontSize="small"
              style={{ color: screenState == "SettingsScreen" && theme.light }}
            />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
