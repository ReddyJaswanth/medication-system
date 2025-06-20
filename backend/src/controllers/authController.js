const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Registration handler
exports.register = [
  // Validation middleware
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['patient', 'caretaker']).withMessage('Role must be patient or caretaker'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = req.db;
    const { username, password, role } = req.body;
    try {
      // Check if user exists
      db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (user) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert user
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          // Generate JWT
          const token = jwt.sign({ id: this.lastID, username, role }, JWT_SECRET, { expiresIn: '7d' });
          res.status(201).json({ token, user: { id: this.lastID, username, role } });
        });
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
];

// Login handler
exports.login = [
  // Validation middleware
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = req.db;
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    });
  }
]; 