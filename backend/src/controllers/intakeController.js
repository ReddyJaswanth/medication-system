// Mark medication as taken for today
exports.markAsTaken = (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  const medication_id = req.params.medicationId;
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Check if already marked as taken today
  db.get(
    'SELECT * FROM intake_logs WHERE user_id = ? AND medication_id = ? AND date = ?',
    [user_id, medication_id, date],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (row) return res.status(400).json({ error: 'Already marked as taken today' });
      db.run(
        'INSERT INTO intake_logs (user_id, medication_id, date, taken) VALUES (?, ?, ?, 1)',
        [user_id, medication_id, date],
        function (err) {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.status(201).json({ success: true });
        }
      );
    }
  );
};

// Get intake logs for user
exports.getLogs = (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  db.all(
    `SELECT il.*, m.name, m.dosage, m.frequency FROM intake_logs il
     JOIN medications m ON il.medication_id = m.id
     WHERE il.user_id = ?
     ORDER BY il.date DESC`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    }
  );
};

// Get adherence percentage for user
exports.getAdherence = (req, res) => {
  const db = req.db;
  const user_id = req.user.id;
  // Count total prescribed doses (medications * days since first medication)
  db.get('SELECT MIN(date) as minDate FROM intake_logs WHERE user_id = ?', [user_id], (err, minRow) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const minDate = minRow && minRow.minDate ? new Date(minRow.minDate) : null;
    if (!minDate) return res.json({ adherence: 0 });
    const today = new Date();
    const days = Math.floor((today - minDate) / (1000 * 60 * 60 * 24)) + 1;
    db.all('SELECT COUNT(*) as taken FROM intake_logs WHERE user_id = ? AND taken = 1', [user_id], (err, takenRows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      db.all('SELECT * FROM medications WHERE user_id = ?', [user_id], (err, meds) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        const totalDoses = meds.length * days;
        const taken = takenRows[0] ? takenRows[0].taken : 0;
        const adherence = totalDoses > 0 ? Math.round((taken / totalDoses) * 100) : 0;
        res.json({ adherence });
      });
    });
  });
}; 