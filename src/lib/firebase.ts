import { iMatch, iUser } from "@/types/types";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  where,
} from "firebase/firestore";

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
export const db = getFirestore(app);

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

// UPDATE MATCH INFO
export const updateMatchInfo = async (uid: string, data: any) => {
  try {
    const collectionRef = collection(db, "matches");
    const docRef = doc(collectionRef, uid);
    
    // Si estamos actualizando las equipos, necesitamos asegurarnos de mantener la estructura correcta
    if (data.teams) {
      const currentDoc = await getDoc(docRef);
      const currentData = currentDoc.data() as iMatch;
      
      // Fusionar los equipos correctamente
      const teamA = data.teams.teamA || currentData.teams.teamA;
      const teamB = data.teams.teamB || currentData.teams.teamB;
      
      // Actualizar con la estructura correcta
      await setDoc(docRef, 
        { 
          ...data,
          teams: {
            teamA,
            teamB
          } 
        }, 
        { merge: true }
      );
    } else {
      // Actualización normal si no tocamos los equipos
      await setDoc(docRef, data, { merge: true });
    }
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
};

// GET MATCH BY ID
export const getMatchById = async (uid: string): Promise<iMatch> => {
  const collectionRef = collection(db, "matches");
  const matchRef = doc(collectionRef, uid);
  const res = await getDoc(matchRef);
  return res.data() as iMatch;
};

// ADMIN FUNCTIONS

export const addYellowProp = async () => {
  try {
    const collectionRef = collection(db, "users");
    const querySnapshot = await getDocs(collectionRef);
    const batch = writeBatch(db);

    querySnapshot.forEach((doc) => {
      const docRef = doc.ref;
      batch.update(docRef, { yellow: false });
    });

    await batch.commit();
    console.log("Finished updating all users");
  } catch (error) {
    console.error("Error updating users:", error);
    throw error;
  }
};

export const addYellowCard = async (uid: string, data: { yellow: boolean }) => {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {}
};

export const usersWithYellowCard = async () => {
  try {
    const result: iUser[] = [];
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("yellow", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push(doc.data() as iUser);
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (name: string) => {
  try {
    const result: iUser[] = [];
    const collectionRef = collection(db, "users");
    const q = query(
      collectionRef,
      where("name", ">=", name),
      where("name", "<=", name + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push(doc.data() as iUser);
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
