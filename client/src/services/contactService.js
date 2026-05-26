import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const submitContact = async (name, email, message) => {
  await addDoc(collection(db, "contacts"), {
    name,
    email,
    message,
    createdAt: new Date()
  });
};