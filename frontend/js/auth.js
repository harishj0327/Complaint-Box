/* ===== Firebase CDN imports ===== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyDzcZLM7TuZ48mOi8SSEH_k3DOgPPCS78c",
  authDomain: "complaint-box-88c9b.firebaseapp.com",
  projectId: "complaint-box-88c9b",
  appId: "1:545419902164:web:74f9ef082557ffe31d0f41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ===== UI STATE ===== */
let signup = false;

window.toggleAuth = function () {
  const layout = document.getElementById("authLayout");
  signup = !signup;
  layout.classList.toggle("swap");

  setTimeout(() => {
    document.getElementById("title").innerText =
      signup ? "Create account" : "Sign in";

    document.getElementById("confirmBlock").style.display =
      signup ? "block" : "none";
  }, 250);
};

/* ===== LOGIN / REGISTER ===== */
document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    let userCred;

    if (signup) {
      userCred = await createUserWithEmailAndPassword(auth, email, password);
    } else {
      userCred = await signInWithEmailAndPassword(auth, email, password);
    }

    const user = userCred.user;
    const token = await user.getIdToken();

    // 🔐 STORE SESSION DATA
    localStorage.setItem("token", token);
    localStorage.setItem("email", user.email);

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
