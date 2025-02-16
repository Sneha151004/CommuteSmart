import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Replace this entire object with your new configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCngJCiaBvEK2DGXLvWz0E_jNFxNaBWYck",
  authDomain: "ecocommute-d6ee5.firebaseapp.com",
  projectId: "ecocommute-d6ee5",
  storageBucket: "ecocommute-d6ee5.firebasestorage.app",
  messagingSenderId: "889298935111",
  appId: "1:889298935111:web:245b2b0808e2dce9e00062"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
