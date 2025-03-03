// backend/routes/generalAnswersRoutes.js
const express = require('express');
const router = express.Router();
const generalAnswersController = require('../controllers/generalAnswersController');

router.post('/', generalAnswersController.createAnswer);

module.exports = router;
