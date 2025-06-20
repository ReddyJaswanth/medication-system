const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDb() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('patient', 'caretaker'))
  )`);

  // Medications table
  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Intake logs table
  db.run(`CREATE TABLE IF NOT EXISTS intake_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    medication_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    taken INTEGER NOT NULL CHECK(taken IN (0, 1)),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(medication_id) REFERENCES medications(id)
  )`);
}

module.exports = initDb; 