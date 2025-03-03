const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:lecture_id', chatController.getChatMessages);
router.post('/', chatController.sendMessage);

module.exports = router;
