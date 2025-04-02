// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUCcivCwgxt_j_oEIVsfjEvFzOBwdxgLU",
  authDomain: "ai-trip-planner-6c1d7.firebaseapp.com",
  projectId: "ai-trip-planner-6c1d7",
  storageBucket: "ai-trip-planner-6c1d7.firebasestorage.app",
  messagingSenderId: "975395607012",
  appId: "1:975395607012:web:d0e02ac44a70c41e6e37f1",
  measurementId: "G-1C6MN5XT3K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);