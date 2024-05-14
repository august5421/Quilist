import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import Avatar from "avataaars";
import { useDispatch, useSelector } from "react-redux";
import {
  setInitListTopInfo,
  setSucceffListSave,
  setInitListInfo,
  setRelativeListRole,
  setListSaveError,
} from "../actions/actions";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import AddFriends from "./AddFriends";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Alert from "@mui/material/Alert";

function ListForm(props) {
  const dispatch = useDispatch();
  const screenState = useSelector((state) => state.screenState);
  const theme = useSelector((state) => state.theme);
  const darkMode = useSelector((state) => state.darkMode);
  const activeListTab = useSelector((state) => state.activeListTab);
  const initListInfo = useSelector((state) => state.initListInfo);
  const activeUser = useSelector((state) => state.activeUser);
  const succeffListSave = useSelector((state) => state.succeffListSave);
  const toastette = useSelector((state) => state.toastette);
  const relativeListRole = useSelector((state) => state.relativeListRole);
  const listSaveError = useSelector((state) => state.listSaveError);
  const [userHelpShown, setUserHelpShown] = useState(false);
  const [hovEffectIndex, setHovEffectIndex] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);
  const listOptions = [
    {
      name: "listQuantity",
      title: "Quantity",
      key: initListInfo.listQuantity,
      itemName: "quantity",
    },
    {
      name: "listUnits",
      title: "Units",
      key: initListInfo.listUnits,
      itemName: "units",
    },
    {
      name: "listImage",
      title: "Image",
      key: initListInfo.listImage,
      itemName: "image",
    },
    {
      name: "listDueDate",
      title: "Due Date",
      key: initListInfo.listDueDate,
      itemName: "dueDate",
    },
    {
      name: "listNote",
      title: "Note",
      key: initListInfo.listNote,
      itemName: "note",
    },
    {
      name: "listAssignee",
      title: "Assignee",
      key: initListInfo.listAssignee,
      itemName: "assignee",
    },
  ];
  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleHovEffect = (index) => {
    setHovEffectIndex(index);
  };

  const handleClickOp = (x, y) => {
    dispatch(setInitListTopInfo(x, !y));
  };

  const handleInputChange = (e) => {
    dispatch(setListSaveError(null));
    const { name, value } = e.target;
    dispatch(setInitListTopInfo(name, value));
  };

  const removeUserFromList = (userIdToRemove) => {
    const updatedListUsers = initListInfo.listUsers.filter(
      (user) => user.id !== userIdToRemove
    );
    dispatch(setInitListTopInfo("listUsers", updatedListUsers));
  };

  const toggleUserHelpShown = () => {
    setUserHelpShown(!userHelpShown);
  };

  useEffect(() => {
    const activeUserAsListUser = {
      id: activeUser.docId,
      listFriendRole: "author-admin",
      listFriendName: activeUser.firstName + " " + activeUser.lastName,
      listFriendAvatar: activeUser.avatar,
    };
    dispatch(setInitListTopInfo("listCreator", activeUserAsListUser));
  }, [activeUser, succeffListSave, toastette]);

  const user = initListInfo.listUsers.find(
    (user) => user.id === activeUser.docId
  );
  useEffect(() => {
    if (user) {
      dispatch(setRelativeListRole(user.listFriendRole));
    }
  }, [user]);

  return (
    <div>
      <Collapse in={succeffListSave || listSaveError}>
        {listSaveError !== null ? (
          <Alert style={{ marginTop: "10px" }} severity="error">
            {listSaveError}
          </Alert>
        ) : (
          <Alert style={{ marginTop: "10px" }} severity="success">
            The list was successfully created
          </Alert>
        )}
      </Collapse>
      <TextField
        focused={darkMode && true}
        id={darkMode ? "filled-basic" : "outlined-basic"}
        color="secondary"
        label="List Name"
        variant="outlined"
        margin="normal"
        size="small"
        name="listName"
        value={initListInfo.listName}
        onChange={handleInputChange}
        style={{ width: "100%" }}
        disabled={relativeListRole == "Editor" || relativeListRole == "Reader"}
        error={listSaveError == "List name cannot be empty"}
      />
      <TextField
        focused={darkMode && true}
        id={darkMode ? "filled-basic" : "outlined-basic"}
        color="secondary"
        label="Description"
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
        size="small"
        name="listDescription"
        value={initListInfo.listDescription}
        onChange={handleInputChange}
        style={{ width: "100%" }}
        disabled={relativeListRole == "Editor" || relativeListRole == "Reader"}
        error={listSaveError == "List description cannot be empty"}
      />
      <Typography
        sx={{
          color: darkMode ? theme.light : theme.primary,
          fontWeight: 700,
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          cursor: "pointer",
          padding: "5px 0px",
        }}
        onClick={toggleShowOptions}
      >
        List Options
        <div style={{ marginLeft: "auto" }}>
          <ExpandMoreIcon
            sx={{
              transform: showOptions ? "rotate(180deg)" : null,
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </Typography>
      <Collapse in={showOptions}>
        {listOptions.map((option, index) => (
          <>
            {option.name == "listAssignee" ? (
              <Fade in={initListInfo.listUsers.length > 0}>
                <Chip
                  key={option.name}
                  label={option.title}
                  color="primary"
                  variant={
                    option.key || index === hovEffectIndex
                      ? "filled"
                      : "outlined"
                  }
                  onDelete={
                    option.key
                      ? () => {
                          handleClickOp(option.name, option.key, true);
                          toggleHovEffect(-1);
                          initListInfo.listItems.map((item, index) => {
                            dispatch(
                              setInitListInfo(index, option.itemName, "")
                            );
                          });
                        }
                      : undefined
                  }
                  style={{ margin: "5px", cursor: "pointer" }}
                  onMouseEnter={() => toggleHovEffect(index)}
                  onMouseLeave={() => toggleHovEffect(-1)}
                  onClick={() => handleClickOp(option.name, option.key)}
                />
              </Fade>
            ) : (
              <Chip
                key={option.name}
                label={option.title}
                color={darkMode ? "secondary" : "primary"}
                variant={
                  option.key || index === hovEffectIndex ? "filled" : "outlined"
                }
                onDelete={
                  option.key
                    ? () => {
                        handleClickOp(option.name, option.key, true);
                        toggleHovEffect(-1);
                        initListInfo.listItems.map((item, index) => {
                          if (option.itemName == "dueDate") {
                            dispatch(
                              setInitListInfo(index, option.itemName, null)
                            );
                          } else {
                            dispatch(
                              setInitListInfo(index, option.itemName, "")
                            );
                          }
                        });
                      }
                    : undefined
                }
                style={{ margin: "5px", cursor: "pointer" }}
                onMouseEnter={() => toggleHovEffect(index)}
                onMouseLeave={() => toggleHovEffect(-1)}
                onClick={() => handleClickOp(option.name, option.key)}
              />
            )}
          </>
        ))}
      </Collapse>
      <Typography
        sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}
      >
        List Users
        <IconButton onClick={toggleUserHelpShown}>
          {userHelpShown ? (
            <RemoveCircleOutlineIcon
              style={{ width: "20px", height: "20px" }}
            />
          ) : (
            <HelpOutlineIcon style={{ width: "20px", height: "20px" }} />
          )}
        </IconButton>
      </Typography>
      <Collapse in={userHelpShown}>
        <Typography sx={{ marginBottom: "10px" }}>
          The list users functionality enables you to collaborate with friends
          by assigning them different roles & permissions.
        </Typography>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography
            sx={{
              color: darkMode ? theme.light : theme.primary,
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Readers&nbsp;
          </Typography>
          can read and check off items on a list
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography
            sx={{
              color: darkMode ? theme.light : theme.primary,
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Editors&nbsp;
          </Typography>
          are able to add and remove items from the list
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography
            sx={{
              color: darkMode ? theme.light : theme.primary,
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Admins&nbsp;
          </Typography>
          only restriction is delete privlleges
        </div>
      </Collapse>
      <Collapse in={initListInfo.listUsers.length > 0}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              margin: "0px 10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                style={{
                  maxWidth: "75px",
                  maxHeight: "75px",
                  marginRight: "10px",
                }}
                avatarStyle="Circle"
                {...initListInfo.listCreator.listFriendAvatar}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {initListInfo.listCreator.listFriendName}
                <br />
                <div style={{ fontSize: "11px", color: "#adadad" }}>
                  {initListInfo.listCreator.listFriendRole}
                </div>
              </div>
            </div>
          </div>
          {initListInfo.listUsers.map((user, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: "0px 10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  style={{
                    maxWidth: "75px",
                    maxHeight: "75px",
                    marginRight: "10px",
                  }}
                  avatarStyle="Circle"
                  {...user.listFriendAvatar}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {user.listFriendName}
                  <br />
                  <div style={{ fontSize: "11px", color: "#adadad" }}>
                    {user.listFriendRole}
                  </div>
                </div>
              </div>
              {relativeListRole == "author-admin" ||
                (relativeListRole == "Admin" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={`Remove ${user.listFriendName} To This List`}
                    >
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => removeUserFromList(user.id)}
                        style={{ width: "50px", height: "50px" }}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </Collapse>

      {activeUser && <AddFriends />}
    </div>
  );
}

export default ListForm;
