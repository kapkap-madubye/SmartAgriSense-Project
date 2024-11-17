import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc, collection } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, updateProfile, deleteUser, EmailAuthProvider  } from 'firebase/auth'
import { updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAMcHsp0cV68ziobGVVJoHlu5f5nMc8oY",
  authDomain: "planteria-e5b8c.firebaseapp.com",
  projectId: "planteria-e5b8c",
  storageBucket: "planteria-e5b8c.appspot.com",
  messagingSenderId: "602430489366",
  appId: "1:602430489366:web:70b3053a31c1fa14004637"
};


let app;
export const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseAppInstance = () => getFirebaseApp();
// Export the Firebase app instance and other Firebase services
export const db = getFirestore(getFirebaseApp());
export const auth = getAuth(getFirebaseApp());
export { updateProfile, getDoc, doc, updateDoc, collection};
export const provider = new GoogleAuthProvider();