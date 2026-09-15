const express = require('express');
const { listConversations, getThread, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/conversations', listConversations);
router.get('/thread/:userId', getThread);
router.post('/', sendMessage);

module.exports = router;
