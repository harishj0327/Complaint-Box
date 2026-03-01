// Utility: get readable location if needed
async function getLocationName(lat, lng) {
  try {
<<<<<<< Updated upstream
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
=======
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Error fetching location name:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// Globals
>>>>>>> Stashed changes
let map;
let activeMarker;

// Initialize map
map = L.map("map").setView([13.0827, 80.2707], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

<<<<<<< Updated upstream
// Focus selected complaint on map
=======
// Focus complaint on map
>>>>>>> Stashed changes
function focusComplaint(lat, lng, popupText) {
  if (activeMarker) map.removeLayer(activeMarker);

  activeMarker = L.marker([lat, lng]).addTo(map);
  if (popupText) activeMarker.bindPopup(popupText).openPopup();
<<<<<<< Updated upstream

  map.setView([lat, lng], 15);
}

// Load complaints of logged-in user
window.loadMyComplaints = async function () {
  const email = localStorage.getItem("email");
  if (!email) return;

  try {
    const res = await fetch(
      `https://complaint-box-zenh.onrender.com/my-complaints?user_email=${email}`
    );
    const complaints = await res.json();

    const list = document.querySelector(".list");
    list.innerHTML = "<h3>My Complaints</h3>";

    if (complaints.length === 0) {
=======
  map.setView([lat, lng], 15);
}

// =========================
// SHOW MY COMPLAINTS (FIXED)
// =========================
window.showComplaints = async function () {
  const list = document.querySelector(".list");
  list.innerHTML = "<h3>My Complaints</h3>";
  document.getElementById("map").style.display = "block";

  if (!window.currentUser) {
    alert("Please login again");
    window.location.href = "login.html";
    return;
  }

  try {
    // 🔐 GET TOKEN
    const token = await window.currentUser.getIdToken();

    const res = await fetch("http://127.0.0.1:8000/my-complaints", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();

    if (data.length === 0) {
>>>>>>> Stashed changes
      list.innerHTML += "<p>No complaints submitted yet.</p>";
      return;
    }

<<<<<<< Updated upstream
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

=======
    for (const c of data) {
      const card = document.createElement("div");
      card.className = "complaint-card";

      card.onclick = () => {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);
        if (isFinite(lat) && isFinite(lng)) {
          focusComplaint(lat, lng, c.text || c.category || "");
        }
      };

      const latVal = parseFloat(c.latitude);
      const lngVal = parseFloat(c.longitude);

      let locationDisplay = c.location;
      if (!locationDisplay && isFinite(latVal) && isFinite(lngVal)) {
        locationDisplay = await getLocationName(latVal, lngVal);
      }
      if (!locationDisplay) locationDisplay = "Unknown location";

      const imageHtml = c.photo_url
        ? `<div class="image-wrap">
             <img src="${c.photo_url}" alt="complaint photo">
           </div>`
        : "";

>>>>>>> Stashed changes
      card.innerHTML = `
        ${imageHtml}
        <div class="content">
          <p><strong>Complaint:</strong> ${c.text}</p>
<<<<<<< Updated upstream
          <p><strong>Location:</strong> ${locationText || "Unknown"}</p>
          <p>
            <strong>Priority:</strong> ${c.priority}
            <span class="priority-dot ${priorityClass}"></span>
=======
          <p><strong>Category:</strong> ${c.category}</p>
          <p><strong>Location:</strong> ${locationDisplay}</p>
          <p><strong>Priority:</strong> ${c.priority}
            <span class="priority-dot ${c.priority.toLowerCase()}"></span>
>>>>>>> Stashed changes
          </p>
        </div>
      `;

      list.appendChild(card);
    }
  } catch (err) {
<<<<<<< Updated upstream
    console.error("Failed to load complaints:", err);
  }
=======
    console.error("Failed to load complaints", err);
    list.innerHTML +=
      "<p style='color:red;'>Failed to load complaints. Please login again.</p>";
  }
};

// =========================
// SHOW PROFILE (NO CHANGE)
// =========================
window.showProfile = function () {
  const user = window.currentUser;
  if (!user) {
    alert("User not logged in");
    return;
  }

  const list = document.querySelector(".list");
  list.innerHTML = "<h3>My Profile</h3>";

  const profileDiv = document.createElement("div");
  profileDiv.className = "profile-info";
  profileDiv.style.textAlign = "center";
  profileDiv.style.padding = "20px";

  const displayName = user.displayName || "Not set";
  const email = user.email;
  const photoURL = user.photoURL;

  profileDiv.innerHTML = `
    <div class="profile-image" style="margin-bottom: 20px;">
      <img src="${photoURL || 'https://via.placeholder.com/100'}"
           style="width:100px;height:100px;border-radius:50%;">
    </div>
    <p><strong>Name:</strong> ${displayName}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;

  list.appendChild(profileDiv);
  document.getElementById("map").style.display = "none";
>>>>>>> Stashed changes
};

window.addEventListener("resize", () => {
  if (map) {
    map.invalidateSize();
  }
});

