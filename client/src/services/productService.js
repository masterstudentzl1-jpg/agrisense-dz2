import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};