const express = require('express');
const { listExperiences, createExperience, toggleUpvote } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listExperiences);
router.post('/', createExperience);
router.post('/:id/upvote', toggleUpvote);

module.exports = router;
