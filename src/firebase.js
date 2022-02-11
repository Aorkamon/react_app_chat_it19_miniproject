// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt-Pc9G2hblEjSFAj9knEl7VYza8CiHeA",
  authDomain: "chat-react-app-test.firebaseapp.com",
  projectId: "chat-react-app-test",
  storageBucket: "chat-react-app-test.appspot.com",
  messagingSenderId: "1067407853198",
  appId: "1:1067407853198:web:cc70658739acd642466bdf",
  databaseURL : "https://chat-react-app-test.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};