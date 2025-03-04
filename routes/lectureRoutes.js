// server/routes/lectureRoutes.js
const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');

router.post('/', lectureController.createLecture);
router.get('/ongoing', lectureController.getOngoingLectures);
router.get('/upcoming', lectureController.getUpcomingLectures);
router.post('/update', lectureController.updateLectureStart);
router.post('/end', lectureController.endLecture);
router.get('/past', lectureController.getPastLectures);
router.get('/:id', lectureController.getLectureById);

module.exports = router;
