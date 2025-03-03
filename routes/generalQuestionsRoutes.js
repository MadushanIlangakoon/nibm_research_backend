const express = require('express');
const router = express.Router();
const generalQuestionsController = require('../controllers/generalQuestionsController');

router.post('/', generalQuestionsController.createQuestion);
router.get('/', generalQuestionsController.getAllQuestions);
router.get('/by-stream', generalQuestionsController.getQuestionsByStream);
router.put('/', generalQuestionsController.updateQuestion);
router.delete('/:id', generalQuestionsController.deleteQuestion);

module.exports = router;
