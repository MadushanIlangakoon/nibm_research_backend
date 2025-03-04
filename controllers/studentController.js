const studentService = require('../services/studentService');

const updateProfile = async (req, res) => {
    try {
        const { auth_id, name, gender, stream, photo } = req.body;
        if (!auth_id) {
            return res.status(400).json({ error: "auth_id is required" });
        }
        const updatedStudent = await studentService.updateProfile({ auth_id, name, gender, stream, photo });
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { updateProfile };
