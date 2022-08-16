import firebase from "firebase/app"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCda_aadtut-jb3yRpg5hXP_pr4VQUUUis",
    authDomain: "shopping-cart-5a054.firebaseapp.com",
    projectId: "shopping-cart-5a054",
    storageBucket: "shopping-cart-5a054.appspot.com",
    messagingSenderId: "179576882327",
    appId: "1:179576882327:web:21f967f29500c34e4995d2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
// const db = getFirestore(firebaseApp)

const db = getFirestore(app);
const storage = getStorage(app);


export { app, db, auth, storage };