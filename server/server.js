const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./database");
const bcrypt = require("bcryptjs"); // For password hashing

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// User registration
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const result = stmt.run(username, hashedPassword);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ id: user.id, username: user.username });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// Get activities for a specific user
app.get("/activities/:userId", (req, res) => {
  const { userId } = req.params;
  const activities = db.prepare("SELECT * FROM activities WHERE userId = ?").all(userId);
  res.json(activities);
});

// Create a new activity
app.post("/activities", (req, res) => {
  const { userId, name, description, image, target, deadline } = req.body;
  const stmt = db.prepare(`
    INSERT INTO activities (userId, name, description, image, target, deadline)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(userId, name, description, image, target, deadline);
  res.json({ id: result.lastInsertRowid });
});

// Add a transaction
app.post("/transactions", (req, res) => {
  const { activityId, transactionId, amount } = req.body;
  const stmt = db.prepare(`
    INSERT INTO transactions (activityId, transactionId, amount)
    VALUES (?, ?, ?)
  `);
  stmt.run(activityId, transactionId, amount);

  // Update funds collected for the activity
  const updateStmt = db.prepare(`
    UPDATE activities
    SET fundsCollected = fundsCollected + ?
    WHERE id = ?
  `);
  updateStmt.run(amount, activityId);

  res.json({ success: true });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});