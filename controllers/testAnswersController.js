const testAnswersService = require('../services/testAnswersService');

const createTestAnswer = async (req, res) => {
    try {
        const { student_id, lecture_id, question_id, student_answer, is_correct, status, response_time } = req.body;
        if (!student_id || !lecture_id || !question_id) {
            return res.status(400).json({ error: "Missing required fields: student_id, lecture_id, or question_id" });
        }
        const answer = await testAnswersService.createTestAnswer({
            student_id,
            lecture_id,
            question_id,
            student_answer,
            is_correct,
            status,
            response_time
        });
        res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createTestAnswer };
