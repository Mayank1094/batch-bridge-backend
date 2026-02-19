import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCh4ZAnKmsDIJZ3qNHUdIhWpT0sht8C10M",
    authDomain: "batch-bridge.firebaseapp.com",
    projectId: "batch-bridge",
    storageBucket: "batch-bridge.firebasestorage.app",
    messagingSenderId: "853642215604",
    appId: "1:853642215604:web:a255f5f7f9a55d6b6457e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
