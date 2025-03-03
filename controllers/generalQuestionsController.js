const generalQuestionsService = require('../services/generalQuestionsService');

const createQuestion = async (req, res) => {
    try {
        const { question_text, hint, correct_answer, explanation, stream } = req.body;
        if (!question_text || !correct_answer || !stream) {
            return res.status(400).json({ error: 'Missing required fields: question_text, correct_answer, or stream' });
        }
        const question = await generalQuestionsService.createQuestion({ question_text, hint, correct_answer, explanation, stream });
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        const questions = await generalQuestionsService.getAllQuestions();
        res.json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getQuestionsByStream = async (req, res) => {
    try {
        const { stream } = req.query;
        if (!stream) {
            return res.status(400).json({ error: "Query parameter 'stream' is required" });
        }
        const questions = await generalQuestionsService.getQuestionsByStream(stream);
        res.json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const { id, question_text, hint, correct_answer, explanation, stream } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Question id is required' });
        }
        const question = await generalQuestionsService.updateQuestion({ id, question_text, hint, correct_answer, explanation, stream });
        res.json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Question id is required' });
        }
        await generalQuestionsService.deleteQuestion(id);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createQuestion, getAllQuestions, getQuestionsByStream, updateQuestion, deleteQuestion };
