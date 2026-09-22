const express = require('express');
const { updateProfile, getMe, listUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.get('/', listUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);

module.exports = router;
