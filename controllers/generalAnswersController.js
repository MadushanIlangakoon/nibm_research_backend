// backend/controllers/generalAnswersController.js
const generalAnswersService = require('../services/generalAnswersService');

const createAnswer = async (req, res) => {
    try {
        const { student_id, question_id, student_answer, is_correct, status, response_time } = req.body;
        if (!student_id || !question_id || is_correct === undefined || !status || response_time === undefined) {
            return res.status(400).json({ error: "Missing required fields: student_id, question_id, is_correct, status, or response_time" });
        }
        const answer = await generalAnswersService.createAnswer({
            student_id,
            question_id,
            student_answer,
            is_correct,
            status,
            response_time,
        });
        res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createAnswer };
