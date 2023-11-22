import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  // apiKey: "AIzaSyADvO4r3MVBEscOq65jWH1TIT5Kl8ndv08",
  // authDomain: "podcast-database-cdb89.firebaseapp.com",
  // projectId: "podcast-database-cdb89",
  // storageBucket: "podcast-database-cdb89.appspot.com",
  // messagingSenderId: "18336606028",
  // appId: "1:18336606028:web:bf81ad4055ffe1fa66d1e9",
  apiKey: "AIzaSyBxJHR1586_WwHfaqhweKuXIhX6_UvAb_A",
  authDomain: "podcast-web-e61f2.firebaseapp.com",
  projectId: "podcast-web-e61f2",
  storageBucket: "podcast-web-e61f2.appspot.com",
  messagingSenderId: "832650203854",
  appId: "1:832650203854:web:f699633458cab2d4d0f69f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getStorage(app);
