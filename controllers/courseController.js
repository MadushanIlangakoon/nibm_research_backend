const courseService = require('../services/courseService');

const createCourse = async (req, res) => {
    try {
        // Log the incoming payload for debugging
        console.log("createCourse payload:", req.body);
        const { teacher_id, subject, title, description } = req.body;

        // Validate required fields
        if (!teacher_id || !subject || !title) {
            return res.status(400).json({ error: "Missing required fields: teacher_id, subject, or title" });
        }

        const course = await courseService.createCourse({ teacher_id, subject, title, description });
        res.status(201).json(course);
    } catch (error) {
        console.error("Error in createCourse:", error);
        res.status(400).json({ error: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseService.getCourseById(id);
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getCoursesByTeacher = async (req, res) => {
    try {
        const { teacher_id } = req.query;
        if (!teacher_id) {
            return res.status(400).json({ error: "teacher_id query parameter is required" });
        }
        const courses = await courseService.getCoursesByTeacher(teacher_id);
        res.json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: "Query parameter 'q' is required" });
        }
        const courses = await courseService.searchCourses(q);
        res.json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const getCoursesBySubject = async (req, res) => {
    try {
        const { subject } = req.query;
        const courses = await courseService.getCoursesBySubject(subject);
        res.json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createCourse, getCoursesByTeacher, searchCourses, getCoursesBySubject, getCourseById };