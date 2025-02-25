const Database = require("better-sqlite3");

// Connect to the database (or create it if it doesn't exist)
const db = new Database("crowdfunding.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    target INTEGER NOT NULL,
    deadline TEXT NOT NULL,
    fundsCollected INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activityId INTEGER NOT NULL,
    transactionId TEXT NOT NULL,
    amount INTEGER NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activityId) REFERENCES activities (id)
  );
`);

module.exports = db;