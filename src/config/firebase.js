import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCdqtZmGq8ZrtCOKOjAbeIfFawKfsU_elY",
  authDomain: "jims-clipboard.firebaseapp.com",
  projectId: "jims-clipboard",
  storageBucket: "jims-clipboard.firebasestorage.app",
  messagingSenderId: "80333118910",
  appId: "1:80333118910:web:2c97f833b0fdf72f736def",
  measurementId: "G-MN7EESZEY5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);