// server/controllers/studentController.js
const studentService = require('../services/studentService');

const getAllStudents = async (req, res) => {
    try {
        const students = await studentService.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getStudentByAuthId = async (req, res) => {
    try {
        const { auth_id } = req.params;
        const student = await studentService.getStudentByAuthId(auth_id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateStudentProfile = async (req, res) => {
    try {
        const { auth_id, name, gender, stream, photo, personalization } = req.body;
        const updatedStudent = await studentService.updateStudentProfile(auth_id, {
            name,
            gender,
            stream,
            photo,
            personalization,
        });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// New controller: Delete student profile.
const deleteStudentProfile = async (req, res) => {
    try {
        const { auth_id } = req.body;
        const result = await studentService.deleteStudentProfile(auth_id);
        res.status(200).json({ message: 'Student profile deleted', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getAllStudents, getStudentByAuthId, updateStudentProfile, deleteStudentProfile };
