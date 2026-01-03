let map;
let activeMarker;
let allComplaints = [];

/* ---------------- MAP ---------------- */
map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

function focusComplaint(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);
  activeMarker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 15);
}

/* ---------------- FETCH ALL COMPLAINTS ---------------- */
fetch("http://127.0.0.1:8000/all-complaints")
  .then(res => res.json())
  .then(data => {
    allComplaints = data;
    renderComplaints(allComplaints);
  });

/* ---------------- RENDER ---------------- */
function renderComplaints(data) {
  const container = document.getElementById("complaintList");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No complaints found.</p>";
    return;
  }

  data.forEach(c => {
    const card = document.createElement("div");
    card.className = "complaint-card";
    card.onclick = () => focusComplaint(c.latitude, c.longitude);

    const imageHTML = c.photo_url
      ? `<div class="image-wrap"><img src="${c.photo_url}" /></div>`
      : "";

    card.innerHTML = `
      ${imageHTML}
      <div class="content">
        <p><strong>Complaint:</strong> ${c.text}</p>
        <p><strong>Location:</strong> ${c.location || "Unknown"}</p>
        <p><strong>Email:</strong> ${c.user_email || "undefined"}</p>
        <p>
          <strong>Priority:</strong> ${c.priority}
          <span class="priority-dot ${c.priority.toLowerCase()}"></span>
        </p>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ---------------- FILTER LOGIC ---------------- */
const filterType = document.getElementById("filterType");
const filterValue = document.getElementById("filterValue");

filterType.addEventListener("change", () => {
  if (!filterType.value) {
    filterValue.style.display = "none";
    return;
  }
  // ✅ ALL COMPLAINTS
  if (filterType.value === "all") {
    filterValue.style.display = "none";
    renderComplaints(allComplaints);
    return;
  }
  filterValue.style.display = "inline-block";
  filterValue.innerHTML = "";

  if (filterType.value === "priority") {
    ["High", "Medium", "Low"].forEach(v =>
      filterValue.innerHTML += `<option value="${v}">${v}</option>`
    );
  }

  if (filterType.value === "category") {
    ["Water", "Electricity", "Road", "Drainage", "Garbage"].forEach(v =>
      filterValue.innerHTML += `<option value="${v}">${v}</option>`
    );
  }

  if (filterType.value === "email") {
    const emails = [...new Set(allComplaints.map(c => c.user_email || "undefined"))];
    emails.forEach(e =>
      filterValue.innerHTML += `<option value="${e}">${e}</option>`
    );
  }
});

filterValue.addEventListener("change", () => {
  const type = filterType.value;
  const value = filterValue.value;

  const filtered = allComplaints.filter(c => {
    if (type === "email") return (c.user_email || "undefined") === value;
    return c[type] === value;
  });

  renderComplaints(filtered);
});
