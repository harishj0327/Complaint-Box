let map;
let marker;
let selectedLat, selectedLng;

// Initialize map
function initMap() {
  map = L.map("map").setView([13.0827, 80.2707], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  map.on("click", function (e) {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;

    if (marker) map.removeLayer(marker);
    marker = L.marker([selectedLat, selectedLng]).addTo(map);
  });
}

document.getElementById("complaintForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    submitComplaint();
  });

async function submitComplaint() {
  if (!window.currentUser) {
    alert("Please login again");
    window.location.href = "login.html";
    return;
  }

  const text = document.getElementById("text").value.trim();
  const photo = document.getElementById("photo").files[0];
  const btn = document.getElementById("submitBtn");

  if (!text || selectedLat === undefined) {
    alert("Please enter complaint and select location");
    return;
  }

  btn.disabled = true;
  btn.innerText = "⏳ Submitting...";

  const formData = new FormData();
  formData.append("text", text);
  formData.append("latitude", selectedLat);
  formData.append("longitude", selectedLng);
  if (photo) formData.append("photo", photo);

  // 🔐 GET FIREBASE ID TOKEN
  const token = await window.currentUser.getIdToken();

  fetch("http://127.0.0.1:8000/complaint", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => {
      document.getElementById("category").innerText = data.category;

      const p = document.getElementById("priority");
      p.innerText = data.priority;
      p.style.color =
        data.priority === "High"
          ? "red"
          : data.priority === "Medium"
          ? "orange"
          : "green";

      document.getElementById("result").style.display = "block";

      btn.innerText = "🚀 Submit Complaint";
      btn.disabled = false;
    })
    .catch(err => {
      console.error(err);
      alert("Submission failed or unauthorized");

      btn.innerText = "🚀 Submit Complaint";
      btn.disabled = false;
    });
}

window.onload = initMap;
