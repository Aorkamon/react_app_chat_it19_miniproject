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
  apiKey: "AIzaSyD10-NLMylGp00QGMKoPBrMo3UMVA1zTlI",
  authDomain: "miniproject-chatapp-react.firebaseapp.com",
  projectId: "miniproject-chatapp-react",
  storageBucket: "miniproject-chatapp-react.appspot.com",
  messagingSenderId: "1082897121927",
  appId: "1:1082897121927:web:40cb877d9e8eb19767ee22",
  databaseURL : "https://miniproject-chatapp-react.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};