import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { db } from '../firebaseConfig';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveListTab } from "../actions/actions";
import Typography from '@mui/material/Typography';
import ListBuilder from '../components/ListBuilder';
import ListViewer from '../components/ListViewer';
import FriendSearch from '../components/FriendSearch';
import MyFriends from '../components/MyFriends'
import MyLists from '../components/MyLists';

function DashboardScreen(props) {
  const dispatch = useDispatch();
  const screenState = useSelector(state => state.screenState);
  const theme = useSelector(state => state.theme);
  const darkMode = useSelector(state => state.darkMode); 
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        '& > :not(style)': {
          width: '100vw',
          minHeight: 'calc(100vh - 96px)',
          position: 'absolute',
          top: 70,
          left: 0,
          padding: '25px 25px 0px 25px',
          maxWidth: 'calc(100% - 50px)',
          backgroundColor: darkMode ? theme.darker : theme.light
        },
      }}
    >
      <Slide direction="up" in={screenState === 'Dashboard'} mountOnEnter unmountOnExit>
      <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'column', flex: '1'}}>
        
        <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'row'}}>
          <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'column', flex: '2', margin: '0px'}}>
              <Box component="section" sx={{ 
                  backgroundColor: '#fff',
                  color: darkMode && theme.lighter,
                  margin: props.mobile ? '0px 0px 16px 0px' : '0px 0px 26px 0px',
                  padding: '12px',
                  borderRadius: '4px',
                  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                  overflowAnchor: 'none',
                  borderRadius: 0,
                  backgroundColor: darkMode ? theme.dark : theme.lighter,
                  minHeight: 'calc(40vh - 98px)',
                  height: '100%'
              }}>
                <Typography sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}>
                  My Lists
                </Typography>
                <MyLists mobile={props.mobile} />
              </Box>
            </div>
            <div style={props.mobile ? {display: 'none'} : {display: 'flex', flexDirection: 'column', flex: '1', margin: '0px 0px 0px 25px'}}>
            <Box component="section" sx={{ 
                  backgroundColor: '#fff',
                  color: darkMode && theme.lighter,
                  margin: '0px 0px 26px 0px',
                  padding: '12px',
                  borderRadius: '4px',
                  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                  overflowAnchor: 'none',
                  borderRadius: 0,
                  backgroundColor: darkMode ? theme.dark : theme.lighter,
                  minHeight: 'calc(40vh - 98px)',
              }}>
                <Typography sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}>
                  Search For Friends
                </Typography>
                <FriendSearch />
              </Box>
              
            </div>
          </div>
          <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'row'}}>
          <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'column', flex: '2'}}>
            <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'row'}}>
              <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <Box component="section" sx={{ 
                    backgroundColor: '#fff',
                    color: darkMode && theme.lighter,
                    margin: '0px 0px 16px 0px',
                    padding: '12px',
                    borderRadius: '4px',
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                    overflowAnchor: 'none',
                    borderRadius: 0,
                    backgroundColor: darkMode ? theme.dark : theme.lighter,
                    minHeight: 'calc(60vh - 98px)'
                }}>
                  <ListBuilder />
                </Box>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', flex: 1, margin: props.mobile ? null : '0px 0px 0px 25px'}}>
                <Box component="section" sx={{ 
                    backgroundColor: '#fff',
                    color: darkMode && theme.lighter,
                    margin: '0px 0px 16px 0px',
                    padding: '12px',
                    borderRadius: '4px',
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                    overflowAnchor: 'none',
                    borderRadius: 0,
                    backgroundColor: darkMode ? theme.dark : theme.lighter,
                    minHeight: 'calc(60vh - 98px)'
                }}>
                  <ListViewer />
                </Box>
              </div>
            </div>
          </div>
          <div style={props.mobile ? {} : {display: 'flex', flexDirection: 'column', flex: '1', margin: '0px 0px 0px 25px'}}>
          
            <Box component="section" sx={{ 
                backgroundColor: '#fff',
                color: darkMode && theme.lighter,
                margin: props.mobile ? '0px 0px 16px 0px' : '0px 0px 26px 0px',
                padding: '12px',
                borderRadius: '4px',
                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                overflowAnchor: 'none',
                borderRadius: 0,
                backgroundColor: darkMode ? theme.dark : theme.lighter,
                minHeight: 'calc(60vh - 98px)',
            }}>
              <Typography sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}>
                My Friends
              </Typography>
              <MyFriends />
            </Box>
            <div style={props.mobile ? {display: 'flex', flexDirection: 'column', flex: '1', margin: '0px'} : {display: 'none'}}>
            <Box component="section" sx={{ 
                  backgroundColor: '#fff',
                  color: darkMode && theme.lighter,
                  margin: '0px 0px 26px 0px',
                  padding: '12px',
                  borderRadius: '4px',
                  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                  overflowAnchor: 'none',
                  borderRadius: 0,
                  backgroundColor: darkMode ? theme.dark : theme.lighter,
                  minHeight: 'calc(40vh - 98px)',
              }}>
                <Typography sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}>
                  Search For Friends
                </Typography>
                <FriendSearch />
              </Box>
              
            </div>
          </div>
        </div>
        </div>
      </Slide>
    </Box>
  );
}

export default DashboardScreen;
