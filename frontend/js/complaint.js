/*************************************************
 * complaint.js
 * Works with:
 * - Firebase auth initialized in complaint.html
 * - window.currentUser
 * - FastAPI backend
 *************************************************/

let map;
let marker;
<<<<<<< Updated upstream
let selectedLat;
let selectedLng;

/* ---------------- MAP INIT ---------------- */
=======
let selectedLat = null;
let selectedLng = null;

// -------------------- INITIALIZE MAP --------------------
>>>>>>> Stashed changes
function initMap() {
  map = L.map("map").setView([13.0827, 80.2707], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

<<<<<<< Updated upstream
  map.on("click", async (e) => {
=======
  map.on("click", async function (e) {
>>>>>>> Stashed changes
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;

    if (marker) map.removeLayer(marker);
    marker = L.marker([selectedLat, selectedLng]).addTo(map);

<<<<<<< Updated upstream
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLat}&lon=${selectedLng}`
      );
      const data = await res.json();
      if (data.display_name) {
        document.getElementById("location").value = data.display_name;
      }
    } catch (err) {
      console.error("Reverse geocoding failed");
=======
    // Reverse geocoding
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLat}&lon=${selectedLng}`
      );
      const data = await resp.json();
      if (data?.display_name) {
        document.getElementById("location").value = data.display_name;
      }
    } catch (err) {
      console.warn("Reverse geocode failed:", err);
>>>>>>> Stashed changes
    }
  });
}

<<<<<<< Updated upstream
/* ---------------- SUBMIT COMPLAINT ---------------- */
document.getElementById("submitBtn").addEventListener("click", submitComplaint);
=======
// -------------------- FORM SUBMIT --------------------
document
  .getElementById("complaintForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    submitComplaint();
  });
>>>>>>> Stashed changes

// -------------------- SUBMIT COMPLAINT --------------------
async function submitComplaint() {
<<<<<<< Updated upstream
  // 🔐 Get user from global set in HTML
  const user = window.currentUser;

  if (!user) {
    alert("Please login again");
=======
  if (!window.currentUser) {
    alert("Session expired. Please login again.");
>>>>>>> Stashed changes
    window.location.href = "login.html";
    return;
  }

  const token = await user.getIdToken(true);

  const text = document.getElementById("text").value.trim();
  const location = document.getElementById("location").value.trim();
  const photo = document.getElementById("photo").files[0];
  const btn = document.getElementById("submitBtn");

<<<<<<< Updated upstream
  if (!text || !location || selectedLat === undefined) {
    alert("Fill all fields and select location");
=======
  if (!text || selectedLat === null || !location) {
    alert("Please enter complaint and select location on map.");
>>>>>>> Stashed changes
    return;
  }

  btn.disabled = true;
  btn.innerText = "⏳ Submitting...";

  const formData = new FormData();
  formData.append("text", text);
  formData.append("location", location);
  formData.append("latitude", selectedLat);
  formData.append("longitude", selectedLng);
  if (photo) formData.append("photo", photo);

  try {
<<<<<<< Updated upstream
    const res = await fetch("https://complaint-box-zenh.onrender.com/complaint", {
=======
    // 🔐 Firebase token
    const token = await window.currentUser.getIdToken();

    const res = await fetch("http://127.0.0.1:8000/complaint", {
>>>>>>> Stashed changes
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

<<<<<<< Updated upstream
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Unauthorized");
    }
=======
    if (!res.ok) throw new Error("Unauthorized");
>>>>>>> Stashed changes

    const data = await res.json();

    document.getElementById("category").innerText = data.category;
<<<<<<< Updated upstream
    document.getElementById("priority").innerText = data.priority;
    document.getElementById("result").style.display = "block";

    // Reset UI
    document.getElementById("text").value = "";
    document.getElementById("photo").value = "";
    if (marker) map.removeLayer(marker);

    btn.disabled = false;
    btn.innerText = "🚀 Submit Complaint";
  } catch (err) {
    console.error(err);
    alert("Submission failed: " + err.message);
    btn.disabled = false;
    btn.innerText = "🚀 Submit Complaint";
  }
}

/* ---------------- LOAD MAP ---------------- */
=======
    const p = document.getElementById("priority");
    p.innerText = data.priority;
    p.style.color =
      data.priority === "High"
        ? "red"
        : data.priority === "Medium"
        ? "orange"
        : "green";

    document.getElementById("result").style.display = "block";

    // Optional redirect after submit
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } catch (err) {
    console.error(err);
    alert("Submission failed. Please login again.");
  } finally {
    btn.innerText = "🚀 Submit Complaint";
    btn.disabled = false;
  }
}

// -------------------- LOAD MAP --------------------
>>>>>>> Stashed changes
window.onload = initMap;
