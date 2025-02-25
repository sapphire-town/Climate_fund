const Database = require("better-sqlite3");
const db = new Database("crowdfunding.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    target INTEGER NOT NULL,
    deadline TEXT NOT NULL,
    fundsCollected INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (userId) REFERENCES users (id)
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