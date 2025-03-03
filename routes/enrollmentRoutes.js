const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.post('/', enrollmentController.requestEnrollment);
router.get('/requests', enrollmentController.getEnrollmentRequests);
router.post('/update', enrollmentController.updateEnrollmentStatus);
router.get('/student', enrollmentController.getEnrollmentsForStudent);

module.exports = router;
