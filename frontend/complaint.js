let map;
let marker;
let selectedLat, selectedLng;

// Initialize OpenStreetMap
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

// Submit complaint to backend
function submitComplaint() {
  const text = document.getElementById("text").value.trim();
  const photo = document.getElementById("photo").files[0];

  if (!text || selectedLat === undefined) {
    alert("Please enter complaint and select location");
    return;
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
    .then(res => res.json())
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
    })
    .catch(err => {
      console.error(err);
      alert("Submission failed");
    });
}


// Load map after page load
window.onload = initMap;
