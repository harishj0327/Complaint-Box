/* Firebase imports */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyDzcZLM7TuZ48mOi8SSEH_k3DOgPPCS78c",
  authDomain: "complaint-box-88c9b.firebaseapp.com",
  projectId: "complaint-box-88c9b",
  appId: "1:545419902164:web:74f9ef082557ffe31d0f41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ADMIN EMAIL */
const ADMIN_EMAIL = "hxrini122007@gmail.com";

/* UI Elements */
const layout = document.getElementById("authLayout");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const confirmBlock = document.getElementById("confirmBlock");
const switchText = document.getElementById("switchText");
const switchLink = document.getElementById("switchLink");


/* Toggle State */
let signup = false;

/* Toggle UI + Animation */
window.toggleAuth = function () {
  signup = !signup;

  // 🔥 Animation trigger
  layout.classList.toggle("swap", signup);

  // Confirm password
  confirmBlock.style.display = signup ? "block" : "none";

  // Text updates
  title.textContent = signup ? "Create account" : "Sign in";
  subtitle.textContent = signup
    ? "Create a new account to continue"
    : "Continue with your account";

  switchText.textContent = signup ? "Already have an account?" : "New here?";
  switchLink.textContent = signup
    ? "Sign in"
    : "Create account";
 
};

/* Login / Signup */
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

    localStorage.setItem("token", token);
    localStorage.setItem("email", user.email);

    // 🔥 ADMIN CHECK
    if (email === ADMIN_EMAIL) {
      alert("✅ Logged in as Admin");
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    alert(err.message);
  }
});
