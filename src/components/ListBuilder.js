import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material'; 
import { db } from '../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveListTab } from "../actions/actions";
import ListForm from './ListForm';

function ListBuilder(props) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const darkMode = useSelector(state => state.darkMode); 
  const activeListTab = useSelector(state => state.activeListTab); 
  const initListInfo = useSelector(state => state.initListInfo);

  return (
    <div>
      <Typography sx={{ color: darkMode ? theme.light : theme.primary, fontWeight: 700 }}>
        {initListInfo.listName !== '' ? initListInfo.listName : 'New List'} 
      </Typography>
      <ListForm />
    </div>
  );
}

export default ListBuilder;
