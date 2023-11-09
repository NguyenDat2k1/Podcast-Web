// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
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
