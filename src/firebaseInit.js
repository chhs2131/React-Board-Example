// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0lueENDZuouvWDh3P1bolHIKek5LW9FU",
    authDomain: "dbsg2024-123456789.firebaseapp.com",
    // "https://dbsg2024-123456789-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dbsg2024-123456789",
    storageBucket: "dbsg2024-123456789.appspot.com",
    messagingSenderId: "258113352663",
    appId: "1:258113352663:web:cb0125e419272718991192",
    // measurementId: "G-0MP17LF67S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app, "https://dbsg2024-123456789-default-rtdb.asia-southeast1.firebasedatabase.app");
export const fs = getFirestore(app, "(default)");
export const st = getStorage(app, "gs://dbsg2024-123456789.appspot.com");
// const analytics = getAnalytics(app);
