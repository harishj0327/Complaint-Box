import { getAuth, updateProfile, sendPasswordResetEmail }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

/* Update Name */
window.updateProfile = async function () {
  const user = auth.currentUser;
  const newName = document.getElementById("name").value.trim();

  if (!newName) {
    alert("Name cannot be empty");
    return;
  }

  try {
    await updateProfile(user, {
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

  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("📧 Password reset email sent");
  } catch (err) {
    alert(err.message);
  }
};

/* Back */
window.goBack = function () {
  window.location.href = "dashboard.html";
};
