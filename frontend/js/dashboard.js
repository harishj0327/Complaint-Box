// Utility: get readable location if needed
async function getLocationName(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch {
    return "Unknown location";
  }
}

// Map globals
let map;
let activeMarker;

// Initialize map
map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// Focus selected complaint on map
function focusComplaint(lat, lng, popupText) {
  if (activeMarker) map.removeLayer(activeMarker);

  activeMarker = L.marker([lat, lng]).addTo(map);
  if (popupText) activeMarker.bindPopup(popupText).openPopup();

  map.setView([lat, lng], 15);
}

// Load complaints of logged-in user
window.loadMyComplaints = async function () {
  const email = localStorage.getItem("email");
  if (!email) return;

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/my-complaints?user_email=${email}`
    );
    const complaints = await res.json();

    const list = document.querySelector(".list");
    list.innerHTML = "<h3>My Complaints</h3>";

    if (complaints.length === 0) {
      list.innerHTML += "<p>No complaints submitted yet.</p>";
      return;
    }

    for (const c of complaints) {
      const card = document.createElement("div");
      card.className = "complaint-card";

      const lat = parseFloat(c.latitude);
      const lng = parseFloat(c.longitude);

      card.onclick = () => {
        if (isFinite(lat) && isFinite(lng)) {
          focusComplaint(lat, lng, c.text);
        }
      };

      // Image block (matches your CSS)
      const imageHtml = c.photo_url
        ? `<div class="image-wrap">
             <img src="${c.photo_url}" alt="complaint image">
           </div>`
        : "";

      // Priority dot color
      const priorityClass = c.priority.toLowerCase(); // low / medium / high

      // Location display
      let locationText = c.location;
      if (!locationText && isFinite(lat) && isFinite(lng)) {
        locationText = await getLocationName(lat, lng);
      }

      card.innerHTML = `
        ${imageHtml}
        <div class="content">
          <p><strong>Complaint:</strong> ${c.text}</p>
          <p><strong>Location:</strong> ${locationText || "Unknown"}</p>
          <p>
            <strong>Priority:</strong> ${c.priority}
            <span class="priority-dot ${priorityClass}"></span>
          </p>
        </div>
      `;

      list.appendChild(card);
    }
  } catch (err) {
    console.error("Failed to load complaints:", err);
  }
};


