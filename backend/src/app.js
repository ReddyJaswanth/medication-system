const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const initDb = require('./models/initDb');
const authRoutes = require('./routes/auth');
const medicationsRoutes = require('./routes/medications');
const intakeRoutes = require('./routes/intake');

// Load environment variables
dotenv.config();

const app = express();

// Initialize Database
initDb();

app.use(cors());
app.use(express.json());

// SQLite database connection
const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Make db accessible via req.db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
}
// ------------------------------------

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/intake', intakeRoutes);

// --- Handle React routing, return all requests to React app ---
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
  });
}
// -------------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // For testing
