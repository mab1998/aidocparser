import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyDf7yYCUWSoNA3SPIVK8ajPOV8qIHfMTSE",
    authDomain: "ai-docparser.firebaseapp.com",
    projectId: "ai-docparser",
    storageBucket: "ai-docparser.firebasestorage.app",
    messagingSenderId: "1054238816570",
    appId: "1:1054238816570:web:a91f5b3f9b3d4bc820b803",
    measurementId: "G-NJ05EQHP2H"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };