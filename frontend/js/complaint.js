let map;
let marker;
let selectedLat, selectedLng;

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
    } catch {}
  });
}

document.getElementById("submitBtn").addEventListener("click", submitComplaint);

async function submitComplaint() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  if (!token || !email) {
    alert("Please login again");
    window.location.href = "login.html";
    return;
  }

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

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();

    document.getElementById("category").innerText = data.category;
    document.getElementById("priority").innerText = data.priority;
    document.getElementById("result").style.display = "block";

    if (marker) map.removeLayer(marker);
    btn.innerText = "🚀 Submit Complaint";
    btn.disabled = false;
  } catch (err) {
    alert("Submission failed");
    btn.disabled = false;
    btn.innerText = "🚀 Submit Complaint";
  }
}

window.onload = initMap;