const express = require('express');
const router = express.Router();
const testAnswersController = require('../controllers/testAnswersController');

// Create a new test answer.
router.post('/', testAnswersController.createTestAnswer);

module.exports = router;
