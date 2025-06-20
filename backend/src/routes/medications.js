const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Add medication
router.post('/', medicationController.addMedication);

// List medications
router.get('/', medicationController.listMedications);

// Update medication
router.put('/:id', medicationController.updateMedication);

// Delete medication
router.delete('/:id', medicationController.deleteMedication);

module.exports = router; 