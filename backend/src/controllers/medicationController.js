const { body, validationResult } = require('express-validator');

// Add new medication
exports.addMedication = [
  body('name').notEmpty().withMessage('Name is required'),
  body('dosage').notEmpty().withMessage('Dosage is required'),
  body('frequency').notEmpty().withMessage('Frequency is required'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = req.db;
    const { name, dosage, frequency } = req.body;
    const user_id = req.user.id;
    db.run(
      'INSERT INTO medications (user_id, name, dosage, frequency) VALUES (?, ?, ?, ?)',
      [user_id, name, dosage, frequency],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: this.lastID, name, dosage, frequency });
      }
    );
  }
];

// List all medications for user
exports.listMedications = (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  db.all('SELECT * FROM medications WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

// Update medication
exports.updateMedication = [
  body('name').notEmpty().withMessage('Name is required'),
  body('dosage').notEmpty().withMessage('Dosage is required'),
  body('frequency').notEmpty().withMessage('Frequency is required'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = req.db;
    const user_id = req.user.id;
    const { name, dosage, frequency } = req.body;
    const id = req.params.id;
    db.run(
      'UPDATE medications SET name = ?, dosage = ?, frequency = ? WHERE id = ? AND user_id = ?',
      [name, dosage, frequency, id, user_id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Medication not found' });
        }
        res.json({ id, name, dosage, frequency });
      }
    );
  }
];

// Delete medication
exports.deleteMedication = (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  const id = req.params.id;
  db.run('DELETE FROM medications WHERE id = ? AND user_id = ?', [id, user_id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json({ success: true });
  });
}; 