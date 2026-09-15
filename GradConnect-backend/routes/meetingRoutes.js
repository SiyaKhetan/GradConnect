const express = require('express');
const { listMyMeetings, requestMeeting, respondToMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listMyMeetings);
router.post('/', requestMeeting);
router.put('/:id/respond', respondToMeeting);

module.exports = router;
