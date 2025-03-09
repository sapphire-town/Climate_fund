let activities = [];

// Fetch activities from the backend
async function fetchActivities() {
  const response = await fetch("/activities");
  activities = await response.json();
  renderActivities();
}

// Add a new activity
async function createActivity(activity) {
  const response = await fetch("/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  });
  const data = await response.json();
  activities.push({ ...activity, id: data.id, fundsCollected: 0 });
  renderActivities();
}

// Add a transaction
async function addTransaction(activityId, transactionId, amount) {
  const response = await fetch("/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityId, transactionId, amount }),
  });
  const data = await response.json();
  if (data.success) {
    const activity = activities.find((a) => a.id === activityId);
    activity.fundsCollected += amount;
    renderActivities();
  }
}

// Render activities
function renderActivities() {
  const activitiesList = document.getElementById("activitiesList");
  if (!activitiesList) return;

  activitiesList.innerHTML = activities
    .map(
      (activity) => `
      <div class="activity-card" data-id="${activity.id}">
        <img src="${activity.image}" alt="${activity.name}">
        <h3>${activity.name}</h3>
        <div class="progress-bar">
          <div class="progress" style="width: ${(activity.fundsCollected / activity.target) * 100}%"></div>
        </div>
        <p>₹${activity.fundsCollected} / ₹${activity.target}</p>
        <button class="btn-primary" onclick="openDonationModal(${activity.id})">Contribute</button>
      </div>
    `
    )
    .join("");
}

// Open Donation Modal
function openDonationModal(activityId) {
  const donationModal = document.getElementById("donationModal");
  donationModal.style.display = "flex";
  donationModal.dataset.activityId = activityId;
}

// Handle Activity Form Submission
document.getElementById("activityForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const activity = {
    name: document.getElementById("activityName").value,
    description: document.getElementById("activityDescription").value,
    image: document.getElementById("activityImage").value,
    deadline: document.getElementById("activityDeadline").value,
    fundsCollected: 0,
    target: 10000, // Default target
  };

  createActivity(activity);
  document.getElementById("activityModal").style.display = "none";
  document.getElementById("activityForm").reset();
});

// Close Modals
document.querySelectorAll(".close").forEach((close) => {
  close.addEventListener("click", () => {
    document.getElementById("activityModal").style.display = "none";
    document.getElementById("donationModal").style.display = "none";
  });
});

// Initial Fetch
fetchActivities();