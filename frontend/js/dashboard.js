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

// Initialize map
map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// Focus complaint on map
function focusComplaint(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);
  activeMarker = L.marker([lat, lng]).addTo(map);
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
        card.onclick = () => focusComplaint(c.latitude, c.longitude);

        const locationDisplay = c.location || await getLocationName(c.latitude, c.longitude);

        card.innerHTML = `
          <div>
            <p>${c.text}</p>
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
