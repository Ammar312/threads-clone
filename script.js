import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTCoIf1kpa7RrmJ-ChKag9vUraUiQOv3M",
  authDomain: "threads-clone-350ba.firebaseapp.com",
  projectId: "threads-clone-350ba",
  storageBucket: "threads-clone-350ba.appspot.com",
  messagingSenderId: "85491243898",
  appId: "1:85491243898:web:3de741fe0b73874b6314c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const signupForm = document.querySelector("#signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = document.querySelector("#userName").value;
  const emailInput = document.querySelector("#emailInput").value;
  const passwordInput = document.querySelector("#passwordInput").value;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, emailInput, passwordInput)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      await updateProfile(auth.currentUser, {
        displayName: userName,
      })
        .then(() => {
          // Profile updated!
          // ...
          const currentUserName = user.displayName;
          sessionStorage.setItem("currentUserName", currentUserName);
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
      const currentUserUID = user.uid;
      console.log(currentUserUID);
      sessionStorage.setItem("currentUserUID", currentUserUID);
      location.assign("home/home.html");
      signupForm.reset();
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // ..
    });
});
