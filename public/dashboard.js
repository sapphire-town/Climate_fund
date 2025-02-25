const user = JSON.parse(localStorage.getItem("user"));

if (!user && window.location.pathname.endsWith("dashboard.html")) {
  window.location.href = "login.html"; // Redirect to login if not logged in
}

// Open Initiate Activity Modal
document.getElementById("initiateActivity").addEventListener("click", () => {
  document.getElementById("activityModal").style.display = "flex";
});

// Close Modal
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("activityModal").style.display = "none";
});

// Handle Activity Form Submission
document.getElementById("activityForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("activityName").value;
  const description = document.getElementById("activityDescription").value;
  const image = document.getElementById("activityImage").value;
  const target = parseInt(document.getElementById("activityTarget").value);
  const deadline = document.getElementById("activityDeadline").value;

  // Validate deadline (min 5 minutes, max 30 days)
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const minDeadline = new Date(now.getTime() + 5 * 60000); // 5 minutes
  const maxDeadline = new Date(now.getTime() + 30 * 24 * 60 * 60000); // 30 days

  if (deadlineDate < minDeadline || deadlineDate > maxDeadline) {
    alert("Deadline must be between 5 minutes and 30 days from now.");
    return;
  }

  // Create activity
  const response = await fetch("/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, name, description, image, target, deadline }),
  });

  if (response.ok) {
    alert("Activity created successfully!");
    document.getElementById("activityModal").style.display = "none";
    fetchActivities(); // Refresh the activities list
  } else {
    alert("Failed to create activity. Please try again.");
  }
});

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

// Initial fetch
fetchActivities();