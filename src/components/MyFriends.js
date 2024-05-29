import React, { useState, useEffect } from "react";
import "./components.css";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  setChangePassword,
  setSearchResults,
  setUserFriends,
} from "../actions/actions";
import Avatar from "avataaars";
import "firebase/firestore";
import { db } from "../firebaseConfig";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";

const MyFriends = (props) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);
  const theme = useSelector((state) => state.theme);
  const searchResults = useSelector((state) => state.searchResults);
  const activeUser = useSelector((state) => state.activeUser);
  const userFriends = useSelector((state) => state.userFriends);
  const screenState = useSelector((state) => state.screenState);
  const handleConfirmFriend = async (x, y) => {
    try {
      const userXDoc = await db.collection("Users").doc(x).get();
      const userYDoc = await db.collection("Users").doc(y).get();
      if (!userXDoc.exists || !userYDoc.exists) {
        console.log("One or both users not found.");
        return;
      }
      const userXData = userXDoc.data();
      const userYData = userYDoc.data();
      const friendsX = userXData.friends || [];
      const friendsY = userYData.friends || [];
      const updatedFriendsX = friendsX.map((friend) => {
        if (friend.friendDocId === y) {
          return { ...friend, status: "accepted" };
        } else {
          return friend;
        }
      });
      db.collection("Users")
        .doc(x)
        .update({
          friends: updatedFriendsX,
        })
        .catch((error) => {
          console.error("Error removing friend from Firestore:", error);
        });
      const updatedFriendsY = friendsY.map((friend) => {
        if (friend.friendDocId === x) {
          return { ...friend, status: "accepted" };
        } else {
          return friend;
        }
      });
      db.collection("Users")
        .doc(y)
        .update({
          friends: updatedFriendsY,
        })
        .catch((error) => {
          console.error("Error removing friend from Firestore:", error);
        });
      dispatch(setUserFriends(updatedFriendsY));
    } catch (error) {
      console.error("Error confirming friends:", error);
    }
  };

  const handleRescindFriend = async (friendDocId) => {
    const updatedUserFriends = userFriends.filter(
      (friend) => friend.friendDocId !== friendDocId
    );
    dispatch(setUserFriends(updatedUserFriends));
    db.collection("Users")
      .doc(activeUser.docId)
      .update({
        friends: updatedUserFriends,
      })
      .catch((error) => {
        console.error("Error removing friend from Firestore:", error);
      });
    const userDocRef = db.collection("Users").doc(friendDocId);
    const docSnapshot = await userDocRef.get();
    if (docSnapshot.exists) {
      const { friends } = docSnapshot.data();
      const updatedRequestedUserFriends = friends.filter(
        (friend) => friend.friendDocId !== activeUser.docId
      );
      db.collection("Users")
        .doc(friendDocId)
        .update({
          friends: updatedRequestedUserFriends,
        })
        .catch((error) => {
          console.error("Error removing friend from Firestore:", error);
        });
    }
  };

  return (
    <>
      {userFriends.length > 0 ? (
        <Collapse in={userFriends.length > 0}>
          {userFriends.map((friend, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                padding: "15px",
                borderBottom:
                  friend.requestingUserId !== activeUser.docId &&
                  friend.status == "pending"
                    ? `2px solid #EAEAEA`
                    : `2px solid #b7b5b5`,
                backgroundColor:
                  friend.requestingUserId !== activeUser.docId &&
                  friend.status == "pending" &&
                  "#EAEAEA",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "15%",
                }}
              >
                <Avatar
                  style={{ width: "100%", maxWidth: "75px", maxHeight: "75px" }}
                  avatarStyle="Circle"
                  {...friend.friendAvatar}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "85%",
                  justifyContent: "center",
                  paddingLeft: "10px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Typography
                    sx={{
                      color: darkMode ? theme.light : theme.primary,
                      fontWeight: 700,
                    }}
                  >
                    {friend.friendFirstName.charAt(0).toUpperCase() +
                      friend.friendFirstName.slice(1)}{" "}
                    {friend.friendLastName.charAt(0).toUpperCase() +
                      friend.friendLastName.slice(1)}
                  </Typography>
                </div>
                <div style={{ color: "#999999", fontSize: "12px" }}>
                  {friend.status == "pending" &&
                  friend.requestingUserId == activeUser.docId
                    ? "Friend Request is Pending"
                    : ""}
                  {friend.status == "pending" &&
                  friend.requestingUserId !== activeUser.docId
                    ? "Would Like to be Friends"
                    : ""}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {friend.status == "pending" ? (
                  <div>
                    {friend.requestingUserId == activeUser.docId ? (
                      <Tooltip title="Rescind Friend Request">
                        <IconButton
                          edge="end"
                          color="warning"
                          onClick={() => {
                            handleRescindFriend(friend.friendDocId);
                          }}
                          style={{ width: "50px", height: "50px" }}
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <Tooltip title="Confirm Friend Request">
                          <IconButton
                            edge="end"
                            color="success"
                            onClick={() => {
                              handleConfirmFriend(
                                friend.friendDocId,
                                activeUser.docId
                              );
                            }}
                            style={{ width: "50px", height: "50px" }}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Decline Friend Request">
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => {
                              handleRescindFriend(friend.friendDocId);
                            }}
                            style={{ width: "50px", height: "50px" }}
                          >
                            <PersonRemoveIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                ) : (
                  <Tooltip title="Remove Friend">
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => {
                        handleRescindFriend(friend.friendDocId);
                      }}
                      style={{ width: "50px", height: "50px" }}
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </Collapse>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaacaf",
            height: "90%",
          }}
        >
          {screenState === "init-Dashboard" ? (
            <>Login to an account to search for and save friends</>
          ) : (
            <>You do not have any friends yet</>
          )}
        </div>
      )}
    </>
  );
};

export default MyFriends;
