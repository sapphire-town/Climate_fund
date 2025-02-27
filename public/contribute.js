// Fetch all activities
async function fetchAllActivities() {
    try {
      const response = await fetch("/activities");
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const activities = await response.json();
      return activities; // Return the fetched activities
    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("Failed to load activities. Please try again.");
      return []; // Return an empty array in case of error
    }
  }
  
  // Render all activities
  function renderAllActivities(activities) {
    const allActivitiesList = document.getElementById("allActivitiesList");
    if (!allActivitiesList) return;
  
    allActivitiesList.innerHTML = activities
      .map(
        (activity) => `
        <div class="activity-card" data-id="${activity.id}">
          <img src="${activity.image || "https://via.placeholder.com/150"}" alt="${activity.name}">
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
  
  // Sort activities
  document.getElementById("sortOptions").addEventListener("change", async (e) => {
    const sortBy = e.target.value;
    const activities = await fetchAllActivities(); // Fetch activities
    if (sortBy === "latest") {
      activities.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (sortBy === "closest") {
      activities.sort((a, b) => (a.fundsCollected / a.target) - (b.fundsCollected / b.target));
    }
    renderAllActivities(activities); // Render sorted activities
  });
  
  // Search activities
  document.getElementById("searchBar").addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activities = await fetchAllActivities(); // Fetch activities
    const filteredActivities = activities.filter((activity) =>
      activity.name.toLowerCase().includes(searchTerm)
    );
    renderAllActivities(filteredActivities); // Render filtered activities
  });
  
  // Initial fetch
  fetchAllActivities().then((activities) => renderAllActivities(activities));