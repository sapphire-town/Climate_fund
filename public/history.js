const user = JSON.parse(localStorage.getItem("user"));

if (!user && window.location.pathname.endsWith("history.html")) {
  window.location.href = "login.html"; // Redirect to login if not logged in
}

// Fetch all activities
async function fetchAllActivities() {
  try {
    const response = await fetch("/activities");
    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }
    const activities = await response.json();
    renderAllActivities(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    alert("Failed to load activities. Please try again.");
  }
}



  // Render all activities
  function renderAllActivities(activities) {
    const historyActivitiesList = document.getElementById("historyActivitiesList");
    if (!historyActivitiesList) return;
  
    historyActivitiesList.innerHTML = activities
      .map(
        (activity) => `
        <div class="activity-card" data-id="${activity.id}">
          <img src="${activity.image || "../assets/placeholder-image.jpg"}" alt="${activity.name}" onclick="showActivityDescription(${activity.id})">
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

  // Show activity description
  function showActivityDescription(activityId) {
    const activity = activities.find(act => act.id === activityId);
    if (activity) {
      alert(activity.description); // Replace with modal or other UI element to show description
    }
  }
  
// Initial fetch
fetchHistory();