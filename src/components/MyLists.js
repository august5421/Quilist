import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { useDispatch, useSelector } from 'react-redux';
import { setUserLists, setInitListInfo, setListInforFromJSON, setInitListTopInfo, resetListInfo, setEditingListId, setToastette, setRelativeListRole } from "../actions/actions";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import LogoFont from '../components/LogoFont';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ChecklistBody from './ChecklistBody';

const MyLists = (props) => {
  const dispatch = useDispatch();
  const userLists = useSelector(state => state.userLists); 
  const activeUser = useSelector(state => state.activeUser);
  const theme = useSelector(state => state.theme);
  const initListInfo = useSelector(state => state.initListInfo);
  const toastette = useSelector(state => state.toastette);
  const succeffListSave = useSelector(state => state.succeffListSave); 
  const relativeListRole = useSelector(state => state.relativeListRole);
  const darkMode = useSelector(state => state.darkMode);
  const editingListId = useSelector(state => state.editingListId);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [showViewer, setShowViewer] = useState(false)
  
  const handleViewerClose = () => {
    handleSaveListChecks()
    setTimeout(() => {
      dispatch(setEditingListId(null))
      dispatch(resetListInfo())
    }, 100)
    setTimeout(() => {
        setShowViewer(false);
    }, 200)
  }
  const handleSaveListChecks = async () => {
    try {
        await db.collection('Lists').doc(editingListId).update(initListInfo);
        dispatch(setInitListTopInfo('listDescription', ''));
        dispatch(setEditingListId(null))
        dispatch(resetListInfo());
    } catch (error) {
        console.error('Error updating document: ', error);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setToastette(false));
  };

  const handleDeleteConfirmation = (list) => {
    setListToDelete(list);
    setDeleteConfirmation(true);
  };

  const handleDeleteList = () => {
    if (listToDelete) {
      db.collection("Lists").doc(listToDelete.id).delete()
        .then(() => {
            dispatch(setToastette(true))
            dispatch(setRelativeListRole(null))
            setTimeout(() => {
                dispatch(setToastette(false))
            }, 3000)
        })
        .catch((error) => {
          console.error("Error removing list: ", error);
        });
    }
    setDeleteConfirmation(false);
    dispatch(setInitListTopInfo('listDescription', ''));
    dispatch(setEditingListId(null))
    dispatch(resetListInfo())
  };

  const handleEditList = (list) => {
    dispatch(setListInforFromJSON(list));
    dispatch(setEditingListId(list.id))
  };

  const handleViewList = (list) => {
    setShowViewer(true)
    setTimeout(() => {
        dispatch(setListInforFromJSON(list));
        dispatch(setEditingListId(list.id))
    }, 100)
  }

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!activeUser || !activeUser.docId) return;
      const creatorQuerySnapshot = await db.collection('Lists').where('listCreator.id', '==', activeUser.docId).get();
      const collaboratorQuerySnapshot = await db.collection('Lists').where('listUserIds', 'array-contains', {id: activeUser.docId}).get();
      const listsData = [];
      creatorQuerySnapshot.forEach(doc => {
        listsData.push({ id: doc.id, ...doc.data() });
      });
      collaboratorQuerySnapshot.forEach(doc => {
        const listData = { id: doc.id, ...doc.data() };
        if (!listsData.find(list => list.id === listData.id)) {
          listsData.push(listData);
        }
      });
      dispatch(setUserLists(listsData));
    };

    fetchUserLists();
  }, [activeUser, succeffListSave, toastette, showViewer]);

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div style={{height: '100%'}}>
        {userLists.length > 0 ? userLists.map((list, index) => {
          const currentUser = list.listUsers.find(user => user.id === activeUser.docId);
          const disableEdit = currentUser && currentUser.listFriendRole === 'Reader';
          return (
            <div key={index}
              style={{display: 'flex', flexDirection: 'row', padding: '15px', borderBottom: '2px solid #EAEAEA', justifyContent: 'space-between'}}
            >
              <div style={{display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
                  {list.listName}
              </div>
              <div style={{display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
                  {list.listDescription.length > 40 ? (
                      `${list.listDescription.substring(0, 37)}...`
                  ) : (
                      list.listDescription
                  )}
              </div>

              <div style={{display: 'flex', flexDirection: 'column', flex: props.mobile ? 1 : 2}}>
                  <div style={{display: 'flex', flexDirection: props.mobile ? 'column' : 'row', justifyContent: 'flex-end'}}>
                    <Button variant="contained" color="primary" onClick={() => handleEditList(list)} disabled={disableEdit}>Edit</Button>
                    <Button variant="contained" color="secondary" sx={{margin: props.mobile ? '10px 0px' : '0px 10px'}} onClick={() => handleViewList(list)}>View</Button>
                    <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(list)} disabled={activeUser.docId !== list.listCreator.id}>Delete</Button>
                  </div>
              </div>
            </div>
          )
        }) : (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaacaf', height: '90%'}}>
                You do not have any lists saved
            </div>
        )}
        <Dialog
          open={deleteConfirmation}
          onClose={() => setDeleteConfirmation(false)}
        >
          <DialogTitle>Delete List</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this list?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmation(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteList} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
            fullScreen
            open={showViewer}
            onClose={handleViewerClose}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <LogoFont text={initListInfo.listName} color={theme.light} fontSize="30px" />
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleViewerClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div style={{padding: '15px', minHeight: 'calc(100vh - 94px)', backgroundColor: darkMode ? theme.dark : theme.lighter}}>
                <ChecklistBody />
            </div>
        </Dialog>
        <Snackbar
            open={toastette}
            autoHideDuration={3000}
            onClose={handleClose}
            message="List deleted successfully"
            action={action}
        />
    </div>
  );
};

export default MyLists;
