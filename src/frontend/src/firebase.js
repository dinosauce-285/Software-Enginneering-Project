import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvty2Thv-n4ymM_72jJxympLOviPjaY4c",
  authDomain: "soulnote-5be01.firebaseapp.com",
  projectId: "soulnote-5be01",
  storageBucket: "soulnote-5be01.firebasestorage.app",
  messagingSenderId: "83068176301",
  appId: "1:83068176301:web:46bc359af01ea1c0cb4324",
  measurementId: "G-HKQY37M0H6"
};

const app = initializeApp(firebaseConfig);

// Lấy instance của dịch vụ Authentication
export const auth = getAuth(app);