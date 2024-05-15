// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA88xQXZCcP4FGIsI_cwIA_DBgNj999z4Y",
    authDomain: "bookreview-d1904.firebaseapp.com",
    projectId: "bookreview-d1904",
    storageBucket: "bookreview-d1904.appspot.com",
    messagingSenderId: "972972874488",
    appId: "1:972972874488:web:5dc5b306c8b3a86113390d",
    measurementId: "G-HLXFBVNJLY"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
