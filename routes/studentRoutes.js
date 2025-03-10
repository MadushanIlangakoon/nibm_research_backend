// server/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/:auth_id', studentController.getStudentByAuthId);
router.put('/profile', studentController.updateStudentProfile);
router.delete('/profile', studentController.deleteStudentProfile);

module.exports = router;
