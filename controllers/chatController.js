const chatService = require('../services/chatService');

const sendMessage = async (req, res) => {
    try {
        const { lecture_id, sender_id, message } = req.body;
        const chatMessage = await chatService.sendMessage({ lecture_id, sender_id, message });
        res.status(201).json(chatMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getChatMessages = async (req, res) => {
    try {
        const { lecture_id } = req.params;
        const messages = await chatService.getChatMessages(lecture_id);
        res.json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { sendMessage, getChatMessages };
