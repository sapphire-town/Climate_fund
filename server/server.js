const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./database");
const bcrypt = require("bcryptjs");
const axios = require("axios");

// Initialize Express app
const app = express();

// Middleware
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

  // Check if the username already exists
  const userExists = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (userExists) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert the new user
  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const result = stmt.run(username, hashedPassword);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Compare the hashed password
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Login successful
  res.json({ id: user.id, username: user.username });
});

// Get all activities
app.get("/activities", (req, res) => {
  const activities = db.prepare("SELECT * FROM activities").all();
  res.json(activities);
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



// Verify Transaction
app.post("/verify-transaction", async (req, res) => {
  const { transactionId, amount } = req.body;

  try {
    const response = await axios.get(`https://api.razorpay.com/v1/payments/${transactionId}`, {
      auth: {
        username: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay API Key
        password: "YOUR_RAZORPAY_KEY_SECRET", // Replace with your Razorpay API Secret
      },
    });

    if (response.data.amount === amount * 100 && response.data.status === "captured") {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});