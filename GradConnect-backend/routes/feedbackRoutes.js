const express = require('express');
const { submitFeedback, getGivenFeedback, getReceivedFeedback, getUsersForFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All feedback routes require authentication
router.use(protect);

// Submit feedback
router.post('/submit', submitFeedback);

// Get feedback given by user
router.get('/given', getGivenFeedback);

// Get feedback received by user
router.get('/received', getReceivedFeedback);

// Get users available for feedback
router.get('/users', getUsersForFeedback);

module.exports = router;