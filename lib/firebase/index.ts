
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxWlNRAu4cMImHebRaZw9i46uFiSYzVUs",
  authDomain: "learn-react-firebase-3f0bc.firebaseapp.com",
  projectId: "learn-react-firebase-3f0bc",
  storageBucket: "learn-react-firebase-3f0bc.appspot.com",
  messagingSenderId: "517103568570",
  appId: "1:517103568570:web:376b510f2c0af421082483",
  measurementId: "G-14Z279VJ4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { app, db }

