const testQuestionsService = require('../services/testQuestionsService');

const createTestQuestion = async (req, res) => {
    try {
        const { test_question_text, test_question_answer, hint, explanation, lectures_id } = req.body;
        if (!test_question_text || !test_question_answer || !lectures_id) {
            return res.status(400).json({ error: "Missing required fields: test_question_text, test_question_answer, or lectures_id" });
        }
        const question = await testQuestionsService.createTestQuestion({ test_question_text, test_question_answer, hint, explanation, lectures_id });
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTestQuestionsByLecture = async (req, res) => {
    try {
        const { lectures_id } = req.query;
        if (!lectures_id) {
            return res.status(400).json({ error: "Query parameter 'lectures_id' is required" });
        }
        const questions = await testQuestionsService.getTestQuestionsByLecture(lectures_id);
        res.json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTestQuestion = async (req, res) => {
    try {
        const { id, test_question_text, test_question_answer, hint, explanation, lectures_id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Question id is required" });
        }
        const question = await testQuestionsService.updateTestQuestion({ id, test_question_text, test_question_answer, hint, explanation, lectures_id });
        res.json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTestQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Question id is required" });
        }
        await testQuestionsService.deleteTestQuestion(id);
        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createTestQuestion, getTestQuestionsByLecture, updateTestQuestion, deleteTestQuestion };
