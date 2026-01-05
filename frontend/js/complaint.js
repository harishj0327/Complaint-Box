/*************************************************
 * complaint.js
 * Works with:
 * - Firebase auth initialized in complaint.html
 * - window.currentUser
 * - FastAPI backend
 *************************************************/

let map;
let marker;
let selectedLat;
let selectedLng;

/* ---------------- MAP INIT ---------------- */
function initMap() {
  map = L.map("map").setView([13.0827, 80.2707], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  map.on("click", async (e) => {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;

    if (marker) map.removeLayer(marker);
    marker = L.marker([selectedLat, selectedLng]).addTo(map);

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
    }
  });
}

/* ---------------- SUBMIT COMPLAINT ---------------- */
document.getElementById("submitBtn").addEventListener("click", submitComplaint);

async function submitComplaint() {
  // 🔐 Get user from global set in HTML
  const user = window.currentUser;

  if (!user) {
    alert("Please login again");
    window.location.href = "login.html";
    return;
  }

  const token = await user.getIdToken(true);

  const text = document.getElementById("text").value.trim();
  const location = document.getElementById("location").value.trim();
  const photo = document.getElementById("photo").files[0];
  const btn = document.getElementById("submitBtn");

  if (!text || !location || selectedLat === undefined) {
    alert("Fill all fields and select location");
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
    const res = await fetch("http://127.0.0.1:8000/complaint", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Unauthorized");
    }

    const data = await res.json();

    document.getElementById("category").innerText = data.category;
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
window.onload = initMap;
