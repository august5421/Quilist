import React from "react";
import { Button, Typography } from "@mui/material";
import { db, storage } from "../firebaseConfig";
import {
  setInitListTopInfo,
  setSucceffListSave,
  resetListInfo,
  setEditingListId,
  setListSaveError,
} from "../actions/actions";
import { useDispatch, useSelector } from "react-redux";
import AutoIncrementor from "./AutoIncrementor";
import Tooltip from '@mui/material/Tooltip';

function ListViewer(props) {
  const dispatch = useDispatch();
  const screenState = useSelector((state) => state.screenState);
  const theme = useSelector((state) => state.theme);
  const darkMode = useSelector((state) => state.darkMode);
  const initListInfo = useSelector((state) => state.initListInfo);
  const succeffListSave = useSelector((state) => state.succeffListSave);
  const editingListId = useSelector((state) => state.editingListId);

  const handleSaveList = async () => {
    if (initListInfo.listName === "") {
      dispatch(setListSaveError("List name cannot be empty"));
      return;
    }
    if (initListInfo.listDescription === "") {
      dispatch(setListSaveError("List description cannot be empty"));
      return;
    }
    if (initListInfo.listItems.length === 0) {
      dispatch(setListSaveError("List must contain at least one item"));
      return;
    }
    const hasBlankItems = initListInfo.listItems.some(
      (item) => item.value === ""
    );
    if (hasBlankItems) {
      dispatch(setListSaveError("All items in the list must have a value"));
      return;
    }

    if (editingListId !== null) {
      try {
        await db.collection("Lists").doc(editingListId).update(initListInfo);
        dispatch(setSucceffListSave(true));
        dispatch(setInitListTopInfo("listDescription", ""));
        dispatch(setEditingListId(null));
        dispatch(resetListInfo());
        setTimeout(() => {
          dispatch(setSucceffListSave(false));
        }, 2000);

        return editingListId;
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      try {
        const uploadImagePromises = [];
        for (const listItem of initListInfo.listItems) {
          if (listItem.image) {
            const imageName = `${listItem.id}_${new Date().getTime()}`;
            const storageRef = storage.ref().child(`listImages/${imageName}`);
            const uploadTask = storageRef.put(listItem.image);
            uploadImagePromises.push(uploadTask);
            uploadTask.then((snapshot) => {
              snapshot.ref.getDownloadURL().then((downloadURL) => {
                listItem.image = downloadURL;
              });
            });
          }
        }
        await Promise.all(uploadImagePromises);
        const docRef = await db.collection("Lists").add(initListInfo);
        dispatch(setSucceffListSave(true));
        dispatch(setInitListTopInfo("listDescription", ""));
        dispatch(resetListInfo());
        setTimeout(() => {
          dispatch(setSucceffListSave(false));
        }, 2000);

        return docRef.id;
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div>
      <Typography
        sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}
      >
        {initListInfo.listName !== ""
          ? initListInfo.listName + " " + "Items"
          : "New List Items"}
      </Typography>
      <AutoIncrementor mobile={props.mobile} veryMobile={props.veryMobile} />
      <Tooltip title={screenState === 'init-Dashboard' ? "Login to save a list" : ""}>
        <span>
          <Button
            variant="contained"
            disabled={screenState === 'init-Dashboard'}
            style={{
              backgroundColor: screenState === 'init-Dashboard' ? '#e5e5e5' : theme.primary,
              margin: "15px 0px",
              width: "100%",
              cursor: screenState === 'init-Dashboard' ? 'not-allowed' : 'pointer'
            }}
            onClick={handleSaveList}
          >
            Save List
          </Button>
        </span>
      </Tooltip>
    </div>
  );
}

export default ListViewer;
