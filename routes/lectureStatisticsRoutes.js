const express = require('express');
const router = express.Router();
const lectureStatisticsController = require('../controllers/lectureStatisticsController');

router.post('/', lectureStatisticsController.createLectureStatistics);

module.exports = router;
