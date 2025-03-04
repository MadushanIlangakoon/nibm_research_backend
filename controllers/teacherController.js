const teacherService = require('../services/teacherService');

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await teacherService.getAllTeachers();
        res.json(teachers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getAllTeachers };
