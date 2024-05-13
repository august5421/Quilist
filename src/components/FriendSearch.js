import React, { useState, useEffect } from "react";
import "./components.css";
import { TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from "react-redux";
import { setActiveUser, setChangePassword, setSearchResults, setUserFriends } from "../actions/actions";
import Avatar from 'avataaars';
import 'firebase/firestore';
import { db } from '../firebaseConfig';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import Box from "@mui/material/Box";
const FriendSearch = (props) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);
  const theme = useSelector(state => state.theme);
  const searchResults = useSelector(state => state.searchResults);
  const activeUser = useSelector(state => state.activeUser);
  const userFriends = useSelector(state => state.userFriends);
  const [searchCriteria, setSearchCriteria] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleAddFriend = (userId, friendAvatar, friendFirstName, friendLastName) => {
    const userDocRef = db.collection('Users').doc(activeUser.docId);
    db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      const currentFriends = userDoc.exists ? userDoc.data().friends || [] : [];
      currentFriends.push({
        friendDocId: userId,
        friendAvatar: friendAvatar,
        friendFirstName: friendFirstName,
        friendLastName: friendLastName,
        status: 'pending',
        requestingUserId: activeUser.docId,
      });
      transaction.update(userDocRef, { friends: currentFriends });
      dispatch(setUserFriends(currentFriends))
    })
    .catch((error) => {
      console.error('Error adding friend: ', error);
    });
    const requestedUserDocRef = db.collection('Users').doc(userId);
    db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(requestedUserDocRef);
    const currentFriends = userDoc.exists ? userDoc.data().friends || [] : [];
    currentFriends.push({
        friendDocId: activeUser.docId,
        friendAvatar: activeUser.avatar,
        friendFirstName: activeUser.firstName,
        friendLastName: activeUser.lastName,
        status: 'pending',
        requestingUserId: activeUser.docId,
    });
        transaction.update(requestedUserDocRef, { friends: currentFriends });
    })
    .catch((error) => {
      console.error('Error adding friend: ', error);
    });
  }
  
  
  useEffect(() => {
    if (searchCriteria === '') {
      dispatch(setSearchResults([]));
    }
  }, [searchCriteria]);

  const handleUserSearch = async () => {
    try {
      const usersRef = db.collection('Users');
      const firstNameSnapshot = await usersRef
        .where('firstName', '>=', searchCriteria.toLowerCase())
        .where('firstName', '<=', searchCriteria.toLowerCase() + '\uf8ff')
        .get();
      const lastNameSnapshot = await usersRef
        .where('lastName', '>=', searchCriteria.toLowerCase())
        .where('lastName', '<=', searchCriteria.toLowerCase() + '\uf8ff')
        .get();
      const results = [];
      firstNameSnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      lastNameSnapshot.forEach((doc) => {
        const data = doc.data();
        if (!results.some((result) => result.docId === data.docId)) {
          results.push(data);
        }
      });
      if (searchCriteria.indexOf(' ') >= 0) {
        const fullNameSnapshot = await usersRef
        .where('firstName', '==', searchCriteria.toLowerCase().split(' ')[0])
        .where('lastName', '==', searchCriteria.toLowerCase().split(' ')[1])
        .get();
        fullNameSnapshot.forEach((doc) => {
            const data = doc.data();
            if (!results.some((result) => result.docId === data.docId)) {
                results.push(data);
            }
        });
      }
      const filteredResults = results.filter(result => result.docId !== activeUser.docId);
      dispatch(setSearchResults(filteredResults));
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  
  
  return (
    <div>
      <TextField
        label="Search For Friends"
        focused={darkMode && true}
        id={darkMode ? 'filled-basic' :  'outlined-basic'}
        color="secondary"
        size='small'
        value={searchCriteria}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={handleUserSearch}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={handleSearchInputChange} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleUserSearch();
          }
        }}
      />
      <Box>
        <Collapse in={searchResults.length > 0}>
            {searchResults.map((result, index) => {
                const isFriend = userFriends.some(friend => friend.friendDocId === result.docId);
                return (
                    <div key={index}
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '15px', borderBottom: `2px solid #EAEAEA`}}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', width: '15%'}}>
                        <Avatar
                            style={{width: '100%', maxWidth: '75px', maxHeight: '75px'}}
                            avatarStyle='Circle'
                            {...(result.avatar)}
                        />
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: '85%', justifyContent: 'center', paddingLeft: '10px'}}>
                            <div style={{display: 'flex', flexDirection:'row'}}>
                                <Typography sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}>
                                    {result.firstName.charAt(0).toUpperCase() + result.firstName.slice(1)} {result.lastName.charAt(0).toUpperCase() + result.lastName.slice(1)} 
                                </Typography>
                            </div>                        
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <Tooltip title={isFriend ? "Friend Already Requested" : "Add Friend"}>
                                <IconButton
                                    edge="end"
                                    color="primary"
                                    onClick={() => {
                                        if (!isFriend) {
                                            handleAddFriend(result.docId, result.avatar, result.firstName, result.lastName)
                                        }
                                    }}
                                    style={{width: '50px', height: '50px', opacity: isFriend ? 0.5 : 1, cursor: isFriend && 'not-allowed'}}
                                >
                                    <PersonAddIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                )
            })}
        </Collapse>
      </Box>
    </div>
  );
};

export default FriendSearch;
