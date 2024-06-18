import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-a6baf.firebaseapp.com",
  projectId: "chatapp-a6baf",
  storageBucket: "chatapp-a6baf.appspot.com",
  messagingSenderId: "642688986994",
  appId: "1:642688986994:web:ac6563adde0edfcec637eb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()