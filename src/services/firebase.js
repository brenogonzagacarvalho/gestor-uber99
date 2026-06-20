// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "gestor-uber99",
  appId: "1:547450104538:web:69be0bafaa194edf4c93e3",
  databaseURL: "https://gestor-uber99-default-rtdb.firebaseio.com",
  storageBucket: "gestor-uber99.firebasestorage.app",
  apiKey: "AIzaSyA8-zonWTI0IRzBsPeM1D8ajfXdU4P2m_g",
  authDomain: "gestor-uber99.firebaseapp.com",
  messagingSenderId: "547450104538"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
export default app;
