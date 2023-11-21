import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADvO4r3MVBEscOq65jWH1TIT5Kl8ndv08",
  authDomain: "podcast-database-cdb89.firebaseapp.com",
  projectId: "podcast-database-cdb89",
  storageBucket: "podcast-database-cdb89.appspot.com",
  messagingSenderId: "18336606028",
  appId: "1:18336606028:web:bf81ad4055ffe1fa66d1e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getStorage(app);
