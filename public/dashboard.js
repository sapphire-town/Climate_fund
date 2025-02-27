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
/*
//Fetch user-specific activities
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

*/

/*


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

*/
// View History
function viewHistory() {
  window.location.href = "history.html"; // Redirect to history page
}

// Initial fetch
fetchActivities();

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
    target: parseInt(document.getElementById("activityTarget").value),
    deadline: document.getElementById("activityDeadline").value,
    fundsCollected: 0,
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
        updateFunds(activityId, amount);
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
        <img src="${activity.image || "../assets/placeholder-image.jpg"}" alt="${activity.name}">
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