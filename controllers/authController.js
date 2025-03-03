// server/controllers/authController.js
const authService = require('../services/authService');

const signup = async (req, res) => {
    try {
        const { role, name, email, password, gender, stream } = req.body;
        const user = await authService.signup({ role, name, email, password, gender, stream });
        res.status(201).json({
            message: 'Signup successful. Please check your email for confirmation.',
            user,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        // result now has { user, role, profile, access_token, refresh_token }

        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            role: result.role,
            profile: result.profile,
            access_token: result.access_token,
            refresh_token: result.refresh_token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        await authService.forgotPassword(email); // 🔥 Pass email as a string

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(400).json({ error: error.message });
    }
};



module.exports = { signup, login, forgotPassword };
