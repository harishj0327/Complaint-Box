// Function to get location name from coordinates
async function getLocationName(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Error fetching location name:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// Declare globals
let map;
let activeMarker;

// Initialize map
map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// Focus complaint on map
// show marker and optional popup text
function focusComplaint(lat, lng, popupText) {
  if (activeMarker) map.removeLayer(activeMarker);
  activeMarker = L.marker([lat, lng]).addTo(map);
  if (popupText) {
    activeMarker.bindPopup(popupText).openPopup();
  }
  map.setView([lat, lng], 15);
}

// 🔥 MAKE FUNCTION GLOBAL
window.loadMyComplaints = async function () {
  if (!window.loggedInEmail) {
    console.warn("Waiting for user email...");
    return;
  }

  fetch(
    `http://127.0.0.1:8000/my-complaints?user_email=${window.loggedInEmail}`
  )
    .then(res => res.json())
    .then(async data => {
      const list = document.querySelector(".list");
      list.innerHTML = "<h3>My Complaints</h3>";

      if (data.length === 0) {
        list.innerHTML += "<p>No complaints submitted yet.</p>";
        return;
      }

      for (const c of data) {
        const card = document.createElement("div");
        card.className = "complaint-card";
        card.onclick = () => {
          const lat = parseFloat(c.latitude);
          const lng = parseFloat(c.longitude);
          if (!isFinite(lat) || !isFinite(lng)) {
            console.warn("Complaint has no valid coordinates:", c);
            return;
          }
          focusComplaint(lat, lng, c.text || c.category || "");
        };

        const latVal = parseFloat(c.latitude);
        const lngVal = parseFloat(c.longitude);
        let locationDisplay;
        if (c.location) {
          locationDisplay = c.location;
        } else if (isFinite(latVal) && isFinite(lngVal)) {
          locationDisplay = await getLocationName(latVal, lngVal);
        } else {
          locationDisplay = "Unknown location";
        }

        const imageHtml = c.photo_url ? `<div class="image-wrap"><img src="${c.photo_url}" alt="complaint photo"></div>` : "";

        card.innerHTML = `
          ${imageHtml}
          <div class="content">
            <p><strong>Complaint:</strong> ${c.text}</p>
            <p><strong>Category:</strong> ${c.category}</p>
            <p><strong>Location:</strong> ${locationDisplay}</p>
            <p><strong>Priority:</strong> ${c.priority} <span class="priority-dot ${c.priority.toLowerCase()}"></span></p>
          </div>
        `;

        list.appendChild(card);
      }
    })
    .catch(err => {
      console.error("Failed to load complaints", err);
    });
};
