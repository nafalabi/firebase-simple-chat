import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import getFBConfig from "./config";

const config = getFBConfig();
initializeApp(config);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
