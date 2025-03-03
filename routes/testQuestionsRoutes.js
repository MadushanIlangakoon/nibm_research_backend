const express = require('express');
const router = express.Router();
const testQuestionsController = require('../controllers/testQuestionsController');

// Create a new test question.
router.post('/', testQuestionsController.createTestQuestion);

// Get all test questions for a specific lecture.
router.get('/', testQuestionsController.getTestQuestionsByLecture);

// Update a test question.
router.put('/', testQuestionsController.updateTestQuestion);

// Delete a test question by id.
router.delete('/:id', testQuestionsController.deleteTestQuestion);

module.exports = router;
