const Post = require('../models/Post');
const Comment = require('../models/Comment');

const formatPost = (post, userId) => ({
  id: post._id,
  author: post.author ? {
    id: post.author._id,
    name: post.author.name || `${post.author.firstName} ${post.author.lastName}`,
    batch: post.author.profile_data?.batch || '',
    company: post.author.profile_data?.company || '',
  } : null,
  title: post.title,
  content: post.content,
  category: post.category,
  tags: post.tags,
  likes: post.likes.length,
  likedByMe: userId ? post.likes.some((id) => id.toString() === userId) : false,
  createdAt: post.createdAt,
});

const listPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name firstName lastName profile_data')
      .sort({ createdAt: -1 })
      .limit(100);

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } }
    ]);
    const countMap = new Map(commentCounts.map((c) => [c._id.toString(), c.count]));

    res.json(posts.map((p) => ({
      ...formatPost(p, req.user.id),
      commentCount: countMap.get(p._id.toString()) || 0,
    })));
  } catch (error) {
    console.error('List posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide a title and content' });
    }

    const post = await Post.create({
      author: req.user.id,
      title,
      content,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
    });

    const populated = await post.populate('author', 'name firstName lastName profile_data');
    res.status(201).json({ ...formatPost(populated, req.user.id), commentCount: 0 });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    res.json({ likes: post.likes.length, likedByMe: !alreadyLiked });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const listComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name firstName lastName')
      .sort({ createdAt: 1 });

    res.json(comments.map((c) => ({
      id: c._id,
      author: c.author ? { id: c.author._id, name: c.author.name || `${c.author.firstName} ${c.author.lastName}` } : null,
      content: c.content,
      createdAt: c.createdAt,
    })));
  } catch (error) {
    console.error('List comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Please provide comment content' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: req.params.id,
      author: req.user.id,
      content,
    });
    const populated = await comment.populate('author', 'name firstName lastName');

    res.status(201).json({
      id: populated._id,
      author: { id: populated.author._id, name: populated.author.name || `${populated.author.firstName} ${populated.author.lastName}` },
      content: populated.content,
      createdAt: populated.createdAt,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listPosts, createPost, toggleLike, listComments, addComment };
