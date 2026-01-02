/* ===== Firebase CDN imports ===== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===== YOUR REAL FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyDzcZLM7TuZ48mOi8SSEH_k3DOgPPCS78c",
  authDomain: "complaint-box-88c9b.firebaseapp.com",
  projectId: "complaint-box-88c9b",
  storageBucket: "complaint-box-88c9b.firebasestorage.app",
  messagingSenderId: "545419902164",
  appId: "1:545419902164:web:74f9ef082557ffe31d0f41"
};

/* ===== Initialize Firebase ===== */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ===== UI STATE ===== */
let signup = false;

/* ===== TOGGLE LOGIN / REGISTER (UNCHANGED UI LOGIC) ===== */
window.toggleAuth = function () {
  const layout = document.getElementById("authLayout");
  signup = !signup;

  layout.classList.toggle("swap");

  setTimeout(() => {
    document.getElementById("title").innerText =
      signup ? "Create account" : "Sign in";

    document.getElementById("subtitle").innerText =
      signup
        ? "Create an account to get started"
        : "Continue with your account";

    document.getElementById("confirmBlock").style.display =
      signup ? "block" : "none";

    document.getElementById("switchText").innerText =
      signup ? "Already have an account?" : "New here?";

    document.querySelector(".switch a").innerText =
      signup ? "Sign in" : "Create account";
  }, 250);
};

/* ===== FORM SUBMIT → FIREBASE AUTH ===== */
document
  .getElementById("authForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (signup) {
      const confirm = document.getElementById("confirmPassword").value;

      if (password !== confirm) {
        alert("❌ Passwords do not match");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("✅ Account created successfully");
          window.location.href = "dashboard.html";
        })
        .catch(err => alert(err.message));

    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("✅ Login successful");
          window.location.href = "dashboard.html";
        })
        .catch(err => alert(err.message));
    }
  });
