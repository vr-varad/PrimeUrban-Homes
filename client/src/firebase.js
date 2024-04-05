// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_GOOGLE_AUTH_API,
    authDomain: "primeurban-7f95b.firebaseapp.com",
    projectId: "primeurban-7f95b",
    storageBucket: "primeurban-7f95b.appspot.com",
    messagingSenderId: "706918314989",
    appId: "1:706918314989:web:f6894c56a00d452d8a2de4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);