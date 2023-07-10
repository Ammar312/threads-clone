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
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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

  try {
    const docRef = await addDoc(collection(db, "thread"), {
      text: textInput,
      createdAt: serverTimestamp(),
    });
    form.reset();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

window.addEventListener("load", () => {
  const q = query(collection(db, "thread"), orderBy("createdAt"));
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
      userNameSpan.innerText = "Ammar Ul Mustafa";
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
      const commentSpan = document.createElement("span");
      commentSpan.classList.add("reactIcon");
      commentSpan.innerHTML = `<i class="bi bi-chat-right"></i>`;
      const teleSpan = document.createElement("span");
      teleSpan.classList.add("reactIcon");
      teleSpan.innerHTML = `<i class="bi bi-chat-right"></i>`;
      reactIconsDiv.appendChild(likeSpan);
      reactIconsDiv.appendChild(heartSpan);
      reactIconsDiv.appendChild(commentSpan);
      reactIconsDiv.appendChild(teleSpan);
      post.appendChild(head);
      post.appendChild(postText);
      post.appendChild(reactIconsDiv);
      postSection.appendChild(post);

      postDeleteBtn.addEventListener("click", () => deletePostFunc(doc.id));
    });
  });
});
const deletePostFunc = async (id) => {
  await deleteDoc(doc(db, "thread", id));
};
