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

// Initial Fetch
fetchActivities();