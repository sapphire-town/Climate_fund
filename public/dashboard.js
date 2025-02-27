// Handle registration
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert("Registration successful! Please login.");
    window.location.href = "login.html";
  } else {
    const data = await response.json();
    alert(data.error || "Registration failed");
  }
});

// Handle login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } else {
    alert("Invalid username or password");
  }
});

const user = JSON.parse(localStorage.getItem("user"));

if (!user && window.location.pathname.endsWith("dashboard.html")) {
  window.location.href = "login.html"; // Redirect to login if not logged in
}

// Fetch user-specific activities
async function fetchActivities() {
  try {
    const response = await fetch(`/activities/${user.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }
    const activities = await response.json();
    renderActivities(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    alert("Failed to load activities. Please try again.");
  }
}

// Render activities
function renderActivities(activities) {
  const activitiesList = document.getElementById("activitiesList");
  if (!activitiesList) return;

  activitiesList.innerHTML = activities
    .map(
      (activity) => `
      <div class="activity-card" data-id="${activity.id}">
        <img src="${activity.image || "../assets/placeholder-image.jpg"}" alt="${activity.name}">
        <h3>${activity.name}</h3>
        <div class="progress-bar">
          <div class="progress" style="width: ${(activity.fundsCollected / activity.target) * 100}%"></div>
        </div>
        <p>₹${activity.fundsCollected} / ₹${activity.target}</p>
        <p>Status: ${activity.status}</p>
        <button class="btn-primary" onclick="openDonationModal(${activity.id})">Contribute</button>
      </div>
    `
    )
    .join("");
}

// Open donation modal
function openDonationModal(activityId) {
  // Implement this function to open the donation modal
  console.log("Open donation modal for activity ID:", activityId);
}

// View History
function viewHistory() {
  window.location.href = "history.html"; // Redirect to history page
}

// Initial fetch
fetchActivities();