// server/controllers/enrollmentController.js
const enrollmentService = require('../services/enrollmentService');

const requestEnrollment = async (req, res) => {
    try {
        const { course_id, student_id } = req.body;
        const enrollment = await enrollmentService.requestEnrollment({ course_id, student_id });
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getEnrollmentsForStudent = async (req, res) => {
    try {
        const { student_id } = req.query;
        if (!student_id) {
            return res.status(400).json({ error: "Query parameter 'student_id' is required" });
        }
        const enrollments = await enrollmentService.getEnrollmentsByStudent(student_id);
        res.json(enrollments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getEnrollmentRequests = async (req, res) => {
    try {
        console.log("GET /enrollments/requests query:", req.query);
        const { teacher_id } = req.query;
        if (!teacher_id) {
            return res.status(400).json({ error: "teacher_id query parameter is required" });
        }
        const requests = await enrollmentService.getEnrollmentRequests({ teacher_id });
        res.json(requests);
    } catch (error) {
        console.error("Error in getEnrollmentRequests:", error);
        res.status(400).json({ error: error.message });
    }
};

const updateEnrollmentStatus = async (req, res) => {
    try {
        const { enrollment_id, status } = req.body;
        const enrollment = await enrollmentService.updateEnrollmentStatus({ enrollment_id, status });
        res.json(enrollment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    requestEnrollment,
    getEnrollmentsForStudent,  // Ensure this is exported
    getEnrollmentRequests,
    updateEnrollmentStatus
};
