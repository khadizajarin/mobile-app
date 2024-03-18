// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, where,query, getDocs  } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMFIeDsa4oyV9QXpC1Q_nWTw3whVn6CAk",
  authDomain: "react-eveplano.firebaseapp.com",
  projectId: "react-eveplano",
  storageBucket: "react-eveplano.appspot.com",
  messagingSenderId: "404069326803",
  appId: "1:404069326803:web:deaf7bed1cb89e07c2d926"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db,  getFirestore, collection, addDoc, where,query, getDocs };

export default app

