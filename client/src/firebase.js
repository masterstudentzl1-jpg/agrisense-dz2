import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyDg7VOLcm9Af-gZCTvTL_LOwiMcbKX9xis",
  authDomain: "agridz.firebaseapp.com",
  projectId: "agridz",
  storageBucket: "agridz.firebasestorage.app",
  messagingSenderId: "180813097632",
  appId: "1:180813097632:web:1000beda002d71124e77c5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);