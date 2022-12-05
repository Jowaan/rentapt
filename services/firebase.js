// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCChmeAZ3TupQz4pXzJOsrh3Y6oxqc8gIs",
  authDomain: "rentapp-b0c6e.firebaseapp.com",
  projectId: "rentapp-b0c6e",
  storageBucket: "rentapp-b0c6e.appspot.com",
  messagingSenderId: "84316359555",
  appId: "1:84316359555:web:03e013b2205c78b6af84b6",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
