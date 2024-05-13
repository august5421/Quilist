import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBcVKbINQX89SXtiYcNBSAgZyQvT0TXBjs",
    authDomain: "syncnshop.firebaseapp.com",
    projectId: "syncnshop",
    storageBucket: "syncnshop.appspot.com",
    messagingSenderId: "927435914564",
    appId: "1:927435914564:web:16a19a340283b159796b11",
    measurementId: "G-7HTZGT86F9"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage(); 

export { db, storage }
