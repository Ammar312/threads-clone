import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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
  const emailInput = document.querySelector("#emailInput").value;
  const passwordInput = document.querySelector("#passwordInput").value;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, emailInput, passwordInput)
    .then((userCredential) => {
      // Signed in
      displayAlert("Login Successfully", "green");
      const user = userCredential.user;
      console.log(user);
      const currentUserUID = user.uid;
      const currentUserName = user.displayName;
      sessionStorage.setItem("currentUserUID", currentUserUID);
      sessionStorage.setItem("currentUserName", currentUserName);
      setTimeout(() => {
        location.assign("home/home.html");
      }, 2000);
      // ...
      signupForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      displayAlert(errorMessage, "red");
      // ..
    });
});
const alertBox = document.querySelector("#alertBox");
const displayAlert = (txt, clss) => {
  alertBox.textContent = txt;
  alertBox.classList.add(clss);
  // remove alert
  setTimeout(() => {
    alertBox.textContent = "";
    alertBox.classList.remove(clss);
  }, 2000);
};
