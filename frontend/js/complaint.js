let map;
let marker;
let selectedLat;
let selectedLng;
let mapInitialized = false;

/* -------------------- SAFETY CHECK -------------------- */
// Prevent this JS from running on other pages
const form = document.getElementById("complaintForm");
if (!form) {
  console.warn("complaintForm not found. complaint.js not initialized.");
} else {

  /* -------------------- MAP INIT -------------------- */
  function initMap() {
    map = L.map("map").setView([13.0827, 80.2707], 13); // Chennai

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    map.on("click", function (e) {
      selectedLat = e.latlng.lat;
      selectedLng = e.latlng.lng;

      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([selectedLat, selectedLng]).addTo(map);
    });
  }

  /* -------------------- BUTTON CLICK -------------------- */
  document
    .getElementById("submitBtn")
    .addEventListener("click", submitComplaint);

  function submitComplaint() {
    const text = document.getElementById("text").value.trim();
    const photoInput = document.getElementById("photo");
    const photo = photoInput ? photoInput.files[0] : null;
    const btn = document.getElementById("submitBtn");

    if (!text || selectedLat === undefined || selectedLng === undefined) {
      alert("Please enter complaint and select location on the map.");
      return;
    }

    // Button loading state
    btn.disabled = true;
    btn.innerText = "⏳ Submitting...";

    // ✅ REMOVE MARKER IMMEDIATELY AFTER SUBMIT
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("latitude", selectedLat);
    formData.append("longitude", selectedLng);
    if (photo) formData.append("photo", photo);

    fetch("http://127.0.0.1:8000/complaint", {
      method: "POST",
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error("Server returned error");
        return res.json();
      })
      .then(data => {
        console.log("Complaint submitted:", data);

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
