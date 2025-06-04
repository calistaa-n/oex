import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf0iSFrawzZBAiXyNFZDhk6DvjfbsJ0UQ",
  authDomain: "oex-app.firebaseapp.com",
  projectId: "oex-app",
  storageBucket: "oex-app.firebasestorage.app",
  messagingSenderId: "341808242432",
  appId: "1:341808242432:web:d0fb7a73a4f1b154ccdde5",
  measurementId: "G-BCH13KN5NB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { app, analytics, auth, db, storage };
