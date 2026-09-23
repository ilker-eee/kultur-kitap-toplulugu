import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-_auJM70_-D_SwLubexfpKvAlFxbNHoo",
  authDomain: "kultur-ve-kitap-db.firebaseapp.com",
  projectId: "kultur-ve-kitap-db",
  storageBucket: "kultur-ve-kitap-db.firebasestorage.app",
  messagingSenderId: "841856166966",
  appId: "1:841856166966:web:fd01b375489a163f67bc97",
  measurementId: "G-YX9ZS0HPXD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
