let map;
let marker;
let selectedLat;
let selectedLng;
let mapInitialized = false;

// Initialize map
function initMap() {
  map = L.map("map").setView([13.0827, 80.2707], 13);

  /* -------------------- MAP INIT -------------------- */
  function initMap() {
    map = L.map("map").setView([13.0827, 80.2707], 13); // Chennai

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

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

  function submitComplaint() {
    const text = document.getElementById("text").value.trim();
    const photoInput = document.getElementById("photo");
    const photo = photoInput ? photoInput.files[0] : null;
    const btn = document.getElementById("submitBtn");

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

    // Button loading state
    btn.disabled = true;
    btn.innerText = "⏳ Submitting...";

    // ✅ REMOVE MARKER IMMEDIATELY AFTER SUBMIT
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }

      btn.innerText = "🚀 Submit Complaint";
      btn.disabled = false;
    })
    .catch(err => {
      console.error(err);
      alert("Submission failed or unauthorized");

        // Show result
        const result = document.getElementById("result");
        result.style.display = "block";
        result.style.visibility = "visible";

        document.getElementById("category").innerText =
          data.category || "N/A";

        const p = document.getElementById("priority");
        p.innerText = data.priority || "N/A";
        p.style.color =
          data.priority === "High"
            ? "red"
            : data.priority === "Medium"
            ? "orange"
            : "green";

        // Reset inputs
        document.getElementById("text").value = "";
        document.getElementById("photo").value = "";

        selectedLat = undefined;
        selectedLng = undefined;

        btn.disabled = false;
        btn.innerText = "🚀 Submit Complaint";
      })
      .catch(err => {
        console.error("Frontend error:", err);
        alert("Submission failed. Please try again.");

        btn.disabled = false;
        btn.innerText = "🚀 Submit Complaint";
      });
  }

  /* -------------------- INIT MAP ONLY ONCE -------------------- */
  if (!mapInitialized) {
    initMap();
    mapInitialized = true;
  }
}

window.onload = initMap;
