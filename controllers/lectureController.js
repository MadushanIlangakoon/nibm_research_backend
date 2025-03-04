// server/controllers/lectureController.js
const lectureService = require('../services/lectureService');

const createLecture = async (req, res) => {
    try {
        const { course_id, teacher_id, title, description, scheduled_at, video_call_url } = req.body;
        const lecture = await lectureService.createLecture({
            course_id,
            teacher_id,
            title,
            description,
            scheduled_at,
            video_call_url,
        });
        res.status(201).json(lecture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getOngoingLectures = async (req, res) => {
    try {
        const { course_id } = req.query;
        if (!course_id) {
            return res.status(400).json({ error: "Query parameter 'course_id' is required" });
        }
        const lectures = await lectureService.getOngoingLectures(course_id);
        res.json(lectures);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUpcomingLectures = async (req, res) => {
    try {
        const { course_id } = req.query;
        if (!course_id) {
            return res.status(400).json({ error: "Query parameter 'course_id' is required" });
        }
        const lectures = await lectureService.getUpcomingLectures(course_id);
        res.json(lectures);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// NEW: Update lecture start endpoint
const updateLectureStart = async (req, res) => {
    try {
        const { lecture_id, started_at } = req.body;
        if (!lecture_id || !started_at) {
            return res.status(400).json({ error: "lecture_id and started_at are required" });
        }
        const lecture = await lectureService.updateLectureStart({ lecture_id, started_at });
        res.json(lecture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getLectureById = async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await lectureService.getLectureById(id);
        if (!lecture) {
            return res.status(404).json({ error: "Lecture not found" });
        }
        res.json(lecture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const endLecture = async (req, res) => {
    try {
        const { lecture_id } = req.body;
        if (!lecture_id) {
            return res.status(400).json({ error: "lecture_id is required" });
        }
        // Set ended_at to current timestamp
        const ended_at = new Date().toISOString();
        const lecture = await lectureService.endLecture({ lecture_id, ended_at });
        res.json(lecture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPastLectures = async (req, res) => {
    try {
        const { course_id } = req.query;
        if (!course_id) {
            return res.status(400).json({ error: "Query parameter 'course_id' is required" });
        }
        const lectures = await lectureService.getPastLectures(course_id);
        res.json(lectures);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = { createLecture, getOngoingLectures, getUpcomingLectures, updateLectureStart, getLectureById, endLecture, getPastLectures };
