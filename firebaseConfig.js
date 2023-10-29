// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, reactNativeLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJAQMt-eOyg5PWPzk7kX7RaF9x6gnUEfo",
  authDomain: "osu-golf-drill-challenge-app.firebaseapp.com",
  databaseURL:
    "https://osu-golf-drill-challenge-app-default-rtdb.firebaseio.com",
  projectId: "osu-golf-drill-challenge-app",
  storageBucket: "osu-golf-drill-challenge-app.appspot.com",
  messagingSenderId: "267068594844",
  appId: "1:267068594844:web:eaed0d9810352c7295ab59",
  measurementId: "G-QFKYHGXKNY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: reactNativeLocalPersistence
})
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
