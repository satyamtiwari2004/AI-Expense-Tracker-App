// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa89NvdOCmN2OYHrIFs596UBBub8PluHI",
  authDomain: "expense-tracker-49b69.firebaseapp.com",
  projectId: "expense-tracker-49b69",
  storageBucket: "expense-tracker-49b69.firebasestorage.app",
  messagingSenderId: "986438922441",
  appId: "1:986438922441:web:b5598c03caf0b60cab5d18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);