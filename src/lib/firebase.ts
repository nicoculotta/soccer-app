import { iUser } from "@/types/types";
import { randomUUID } from "crypto";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { iMatch } from "./schemaFirebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export const createUser = async (uid: string, data: iUser) => {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, data);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (uid: string) => {
  const collectionRef = collection(db, "users");
  const userRef = doc(collectionRef, uid);
  const res = await getDoc(userRef);
  return res.data();
};

export const updateUserRole = async (
  uid: string,
  data: { role: "admin" | "user" }
) => {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {}
};

export const getAllUsers = async (): Promise<iUser[]> => {
  try {
    const users: iUser[] = [];
    const collectionRef = collection(db, "users");
    const querySnapshot = await getDocs(collectionRef);

    querySnapshot.forEach((doc) => {
      users.push(doc.data() as iUser);
    });

    return users;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// CREATE MATCH

export const createMatch = async (data: iMatch) => {
  try {
    const collectionRef = collection(db, "matches");
    const docRef = doc(collectionRef, data.id);
    await setDoc(docRef, data);
    return { message: "Match created", data };
  } catch (error) {
    console.error("Error creating a match:", error);
    throw error;
  }
};

// DELETE MATCH

export const deleteMatch = async (id: string) => {
  try {
    const collectionRef = collection(db, "matches");
    const docRef = doc(collectionRef, id);
    console.log(docRef);
    await deleteDoc(docRef);
    return { message: "Match deleted" };
  } catch (error) {
    console.error("Error deleting a match:", error);
    throw error;
  }
};

// GET ALL MATCHES
export const getAllMatches = async (): Promise<iMatch[]> => {
  try {
    const matches: iMatch[] = [];
    const collectionRef = collection(db, "matches");
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      matches.push(doc.data() as iMatch);
    });
    return matches;
  } catch (error) {
    console.error("Error getting all matches:", error);
    throw error;
  }
};
