let map;
let activeMarker;

/* -------------------- MAP INIT -------------------- */
map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

/* -------------------- FETCH COMPLAINTS -------------------- */
fetch("http://127.0.0.1:8000/complaints")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch complaints");
    }
    return res.json();
  })
  .then(data => {
    const list = document.querySelector(".list");
    list.innerHTML = "<h3>Complaints</h3>";

    if (data.length === 0) {
      list.innerHTML += "<p>No complaints found.</p>";
      return;
    }

    data.forEach(c => {
      const card = document.createElement("div");
      card.className = "complaint-card";

      card.onclick = () => focusComplaint(c.latitude, c.longitude);

      card.innerHTML = `
        <img src="${c.photo_url ? c.photo_url : './assets/placeholder.jpg'}" alt="Complaint image">
        <div>
          <p>${c.text}</p>
          <span class="badge ${c.priority.toLowerCase()}">
            ${c.priority}
          </span>
        </div>
      `;

      list.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Dashboard error:", err);
  });

/* -------------------- MAP FOCUS -------------------- */
function focusComplaint(lat, lng) {
  if (activeMarker) {
    map.removeLayer(activeMarker);
  }

  activeMarker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 15);
}
