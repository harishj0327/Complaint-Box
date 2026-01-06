import {
  getAuth,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

/* Update Name */
window.updateProfile = async function () {
  const user = auth.currentUser;
  const newName = document.getElementById("name").value.trim();

  if (!user) {
    alert("User not logged in");
    return;
  }

  if (!newName) {
    alert("Name cannot be empty");
    return;
  }

  try {
    await firebaseUpdateProfile(user, {
      displayName: newName
    });

    alert("✅ Profile updated successfully");
  } catch (err) {
    alert(err.message);
  }
};

/* Reset Password */
window.resetPassword = async function () {
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("📧 Password reset email sent");
  } catch (err) {
    alert(err.message);
  }
};
window.goBack = function () {
  window.location.href = "dashboard.html";
};
