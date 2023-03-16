// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBNzIvMlXrRzSBppvFeH6gMn5jBWNH8ax8",
	authDomain: "quizzical-7d043.firebaseapp.com",
	projectId: "quizzical-7d043",
	storageBucket: "quizzical-7d043.appspot.com",
	messagingSenderId: "178714986638",
	appId: "1:178714986638:web:dca53163d7efe56291a1df",
	measurementId: "G-8HKC3PBWCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const appAuth = getAuth(app);
export const AppDB = getFirestore(app);
export const appStorage = getStorage(app);
