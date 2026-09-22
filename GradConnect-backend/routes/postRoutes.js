const express = require('express');
const { listPosts, createPost, toggleLike, listComments, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listPosts);
router.post('/', createPost);
router.post('/:id/like', toggleLike);
router.get('/:id/comments', listComments);
router.post('/:id/comments', addComment);

module.exports = router;
