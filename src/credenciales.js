// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAM0EkXCm9m0IxVh-rnm2XSEfRBKVVMOUs",
  authDomain: "test-cf45a.firebaseapp.com",
  projectId: "test-cf45a",
  storageBucket: "test-cf45a.appspot.com",
  messagingSenderId: "991954293659",
  appId: "1:991954293659:web:fe16a227468306ba21473e"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;