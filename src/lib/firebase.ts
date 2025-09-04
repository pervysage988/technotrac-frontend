// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "fieldfriend",
  "appId": "1:1093512346991:web:0c2ced5e603f0c46cf3c9a",
  "storageBucket": "fieldfriend.firebasestorage.app",
  "apiKey": "AIzaSyCIbqtklT4rJLhVpuhsIFrZbCSrj_MyjlU",
  "authDomain": "fieldfriend.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1093512346991"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
