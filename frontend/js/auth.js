let signup = false;

function toggleAuth() {
  const layout = document.getElementById("authLayout");

  signup = !signup;

  // Trigger panel swap
  layout.classList.toggle("swap");

  // Update content mid-animation
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
}

document
  .getElementById("authForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "dashboard.html";
  });
