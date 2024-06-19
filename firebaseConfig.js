// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { devConfig } from "~/firebaseApiKey";

// Initialize Firebase
const app = initializeApp(devConfig);
const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
const auth = initializeAuth(app, { persistence });
const db = getFirestore(app);

module.exports = { auth, db };
