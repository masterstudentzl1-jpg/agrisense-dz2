import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const placeOrder = async (userId, productId, quantity, totalPrice) => {
  await addDoc(collection(db, "orders"), {
    userId,
    productId,
    quantity,
    totalPrice,
    status: "pending",
    createdAt: new Date()
  });
};