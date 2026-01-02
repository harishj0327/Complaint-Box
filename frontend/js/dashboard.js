let map;
let activeMarker;

map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

function focusComplaint(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);

  activeMarker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 15);
}
