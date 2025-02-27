const user = JSON.parse(localStorage.getItem("user"));

if (!user && window.location.pathname.endsWith("history.html")) {
  window.location.href = "login.html"; // Redirect to login if not logged in
}

// Fetch user-specific activities
async function fetchHistory() {
  try {
    const response = await fetch(`/activities/${user.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }
    const activities = await response.json();
    renderHistory(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    alert("Failed to load activities. Please try again.");
  }
}

// Render activities
function renderHistory(activities) {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  historyList.innerHTML = activities
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
      </div>
    `
    )
    .join("");
}

// Initial fetch
fetchHistory();