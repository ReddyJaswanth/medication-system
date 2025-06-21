const express = require('express');
const router = express.Router();
const intakeController = require('../controllers/intakeController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Mark medication as taken for today
router.post('/:medicationId', intakeController.markAsTaken);

// Get intake logs
router.get('/logs', intakeController.getLogs);

// Get adherence percentage
router.get('/adherence', intakeController.getAdherence);

module.exports = router; 