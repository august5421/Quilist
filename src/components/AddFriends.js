import React, { useState, useEffect } from 'react';
import db from '../firebaseConfig';
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Typography, IconButton, InputAdornment, MenuItem, Select } from "@mui/material";
import { setInitListTopInfo } from "../actions/actions";
import Avatar from 'avataaars';
import Collapse from '@mui/material/Collapse';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Tooltip from '@mui/material/Tooltip';

const AddFriends = () => {
  const dispatch = useDispatch();
  const screenState = useSelector(state => state.screenState);
  const theme = useSelector(state => state.theme);
  const darkMode = useSelector(state => state.darkMode); 
  const settingsExpanded = useSelector(state => state.settingsExpanded);
  const activeUser = useSelector(state => state.activeUser); 
  const initListInfo = useSelector(state => state.initListInfo);
  const relativeListRole = useSelector(state => state.relativeListRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Reader'); 
  
  useEffect(() => {
    if (activeUser.friends !== undefined) {
      const filteredResults = activeUser.friends.filter(user =>
        (user.friendFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.friendLastName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      if (searchQuery !== '') {
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    }
  }, [searchQuery]);

  const handleAddListUser = (w, x, y, z) => {
    const newListUsers = [
      ...initListInfo.listUsers,
      { id: x, listFriendRole: y, listFriendName: z, listFriendAvatar: w }
    ];
    const newListUserIds = [
      ...initListInfo.listUserIds,
      { id: x }
    ];
    dispatch(setInitListTopInfo('listUsers', newListUsers));
    dispatch(setInitListTopInfo('listUserIds', newListUserIds));
  }

  return (
    <div>
      <TextField
        focused={darkMode && true}
        id={darkMode ? 'filled-basic' :  'outlined-basic'}
        color="secondary"
        label="Add Users"
        variant="outlined"
        margin="normal"
        size="small"
        name="friendSearch"
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{width: '100%'}}
        disabled={relativeListRole == 'Editor' || relativeListRole == 'Reader'}
      />
      <Collapse in={searchResults.length > 0}>
        {searchResults.map(user => (
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0px 0px 15px 0px', borderBottom: `2px solid #EAEAEA`, padding: '5px' }} key={user.friendDocId}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Avatar
                style={{maxWidth: '75px', maxHeight: '75px', marginRight: '10px'}}
                avatarStyle='Circle'
                {...(user.friendAvatar)}
              />
              {user.friendFirstName.charAt(0).toUpperCase() + user.friendFirstName.slice(1) + ' ' + user.friendLastName.charAt(0).toUpperCase() + user.friendLastName.slice(1)}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              
              {initListInfo.listUsers.some(listUser => listUser.id === user.friendDocId) ? (
                <Tooltip title={`Friend Already Added`}>
                  <IconButton
                    edge="end"
                    color="primary"
                    style={{width: '50px', height: '50px', opacity: 0.5, cursor: 'not-allowed'}}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    size="small"
                    sx={{width: '200px'}}
                  >
                    <MenuItem value="Reader">Reader</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                  <Tooltip title={`Add ${user.friendFirstName.charAt(0).toUpperCase() + user.friendFirstName.slice(1) + ' ' + user.friendLastName.charAt(0).toUpperCase() + user.friendLastName.slice(1)} To This List`}>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => {
                        handleAddListUser(user.friendAvatar, user.friendDocId, selectedRole, user.friendFirstName.charAt(0).toUpperCase() + user.friendFirstName.slice(1) + ' ' + user.friendLastName.charAt(0).toUpperCase() + user.friendLastName.slice(1))
                      }}
                      style={{width: '50px', height: '50px'}}
                    >
                      <PersonAddIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        ))}
      </Collapse>
    </div>
  );
};

export default AddFriends;
