const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/create-course', courseController.createCourse);
router.get('/get-course-subject', courseController.getCoursesBySubject);
router.get('/by-teacher', courseController.getCoursesByTeacher);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourseById);


module.exports = router;
