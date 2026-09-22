const express = require('express');
const { listEvents, createEvent, registerForEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listEvents);
router.post('/', createEvent);
router.post('/:id/register', registerForEvent);

module.exports = router;
