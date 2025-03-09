let activities = [];

// DOM Elements
const initiateActivityBtn = document.getElementById("initiateActivity");
const activityModal = document.getElementById("activityModal");
const donationModal = document.getElementById("donationModal");
const closeModals = document.querySelectorAll(".close");
const activityForm = document.getElementById("activityForm");
const transactionForm = document.getElementById("transactionForm");
const activitiesList = document.getElementById("activitiesList");
const searchBar = document.getElementById("searchBar");
const sortOptions = document.getElementById("sortOptions");

// Check if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (!user && window.location.pathname.endsWith("dashboard.html")) {
  window.location.href = "login.html"; // Redirect to login if not logged in
}

// Open Activity Modal
initiateActivityBtn.addEventListener("click", () => {
  activityModal.style.display = "flex";
});

// Close Modals
closeModals.forEach((close) => {
  close.addEventListener("click", () => {
    activityModal.style.display = "none";
    donationModal.style.display = "none";
  });
});

// Handle Activity Form Submission
activityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const activity = {
    id: Date.now(),
    name: document.getElementById("activityName").value,
    description: document.getElementById("activityDescription").value,
    image: document.getElementById("activityImage").value,
    deadline: document.getElementById("activityDeadline").value,
    fundsCollected: 0,
    target: 10000, // Default target
  };

  activities.push(activity);
  renderActivities();
  activityModal.style.display = "none";
  activityForm.reset();
});

// Handle Transaction Form Submission
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const transactionId = document.getElementById("transactionId").value;
  const amount = parseInt(document.getElementById("amount").value);

  if (isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  // Verify transaction using Razorpay API (backend)
  fetch("/verify-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId, amount }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Transaction verified successfully!");
        updateFunds(donationModal.dataset.activityId, amount);
      } else {
        alert("Invalid transaction details.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  donationModal.style.display = "none";
  transactionForm.reset();
});

// Render Activities
function renderActivities() {
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
  donationModal.style.display = "flex";
  donationModal.dataset.activityId = activityId;
}

// Update Funds
function updateFunds(activityId, amount) {
  const activity = activities.find((a) => a.id == activityId);
  activity.fundsCollected += amount;
  renderActivities();
}

// Initial Render
renderActivities();