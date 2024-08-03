import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//     apiKey: "AIzaSyA6qUFTlvGlyWTcqn4A2tBjpeAQm1I_b_s",
//     authDomain: "codeui-node.firebaseapp.com",
//     projectId: "codeui-node",
//     storageBucket: "codeui-node.appspot.com",
//     messagingSenderId: "933189481718",
//     appId: "1:933189481718:web:55f0f57bb7c4724ae328d7",
//     measurementId: "G-D3CCCJZTZQ",
//     databaseURL:
//       "https://codeui-node-default-rtdb.asia-southeast1.firebasedatabase.app",
//   };
  const firebaseConfig = {
    apiKey: "AIzaSyDo7rgTn6KJCXWixt6ti2RhcNMLdkEOgq0",
    authDomain: "uploadimage-e45cd.firebaseapp.com",
    projectId: "uploadimage-e45cd",
    storageBucket: "uploadimage-e45cd.appspot.com",
    messagingSenderId: "92049720503",
    appId: "1:92049720503:web:7175ded47ae373a5aef932",
    measurementId: "G-7KDNNF5DF9"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app);
  // export const auth = getAuth(app);
  // export const db = getFirestore(app);
  // export const database = getDatabase(app);