const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Endpoint for updating student profile
router.put('/profile', studentController.updateProfile);

module.exports = router;
