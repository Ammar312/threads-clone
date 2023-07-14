import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  deleteDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const form = document.querySelector("#form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const textInput = document.querySelector("#textInput").value;
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      const userName = sessionStorage.getItem("currentUserName");
      // console.log(userName);

      try {
        const docRef = await addDoc(collection(db, "thread"), {
          text: textInput,
          createdAt: serverTimestamp(),
          userUid: uid,
          currentUserName: userName,
          likeIncrement: 0,
          heartIncrement: 0,
        });
        form.reset();

        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      // User is signed out
      // ...
    }
  });
});
window.addEventListener("load", () => {
  const q = query(collection(db, "thread"), orderBy("createdAt", "desc"));
  const postSection = document.querySelector("#postSection");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    postSection.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const post = document.createElement("div");
      post.classList.add("post");
      const head = document.createElement("div");
      head.classList.add("head");
      const userInfo = document.createElement("div");
      userInfo.classList.add("userInfo");
      const userImgSpan = document.createElement("span");
      userImgSpan.innerHTML = `<i class="bi bi-person-fill"></i>`;
      userImgSpan.classList.add("userImgSpan");
      const userNameSpan = document.createElement("span");
      userNameSpan.classList.add("userNameSpan");
      userNameSpan.innerText = `${
        doc.data().currentUserName ? doc.data().currentUserName : "username"
      }`;
      userInfo.appendChild(userImgSpan);
      userInfo.appendChild(userNameSpan);
      const postDeleteBtn = document.createElement("button");
      postDeleteBtn.classList.add("postDeleteBtn");
      postDeleteBtn.id = `${doc.id}`;
      postDeleteBtn.innerText = "Delete Post";
      head.appendChild(userInfo);
      head.appendChild(postDeleteBtn);

      const postText = document.createElement("div");
      postText.classList.add("postText");
      postText.innerText = `${doc.data().text}`;

      const reactIconsDiv = document.createElement("div");
      reactIconsDiv.classList.add("reactIconsDiv");
      const likeSpan = document.createElement("span");
      likeSpan.classList.add("reactIcon");
      likeSpan.innerHTML = `<i class="bi bi-hand-thumbs-up"></i>`;
      const heartSpan = document.createElement("span");
      heartSpan.classList.add("reactIcon");
      heartSpan.innerHTML = `<i class="bi bi-heart"></i>`;
      reactIconsDiv.appendChild(likeSpan);
      reactIconsDiv.appendChild(heartSpan);

      post.appendChild(head);
      post.appendChild(postText);
      post.appendChild(reactIconsDiv);
      postSection.appendChild(post);

      postDeleteBtn.addEventListener("click", () => deletePostFunc(doc.id));
      likeSpan.addEventListener("click", () => likeIncrement(doc.id));
      heartSpan.addEventListener("click", () => heartIncrement(doc.id));
    });
  });
});
// Retrieve the UID from session storage
const currentUserUID = sessionStorage.getItem("currentUserUID");

const deletePostFunc = async (id) => {
  const postDocRef = doc(db, "thread", id);

  try {
    const postSnapshot = await getDoc(postDocRef);
    const postData = postSnapshot.data();

    // Check if the current user is the owner of the post
    if (postData.userUid === currentUserUID) {
      await deleteDoc(postDocRef);
      console.log("Post deleted successfully");
    } else {
      console.log("You are not authorized to delete this post");
    }
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
};

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      sessionStorage.removeItem("currentUserName");
      location.replace("../login.html");
    })
    .catch((error) => {
      // An error happened.
    });
});
const userNameHead = sessionStorage.getItem("currentUserName");
document.querySelector("#userName").innerText = userNameHead;

const user = document.querySelector("#user");
user.addEventListener("mouseover", () => {
  document.querySelector("#logout").style.display = "block";
});
document.querySelector("body").addEventListener("click", () => {
  document.querySelector("#logout").style.display = "none";
});

const likeIncrement = async (id) => {
  const washingtonRef = doc(db, "thread", id);
  await updateDoc(washingtonRef, {
    likeIncrement: increment(1),
  });
};
const heartIncrement = async (id) => {
  const washingtonRef = doc(db, "thread", id);
  await updateDoc(washingtonRef, {
    heartIncrement: increment(1),
  });
};
