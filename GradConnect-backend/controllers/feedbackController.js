const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { toUserId, rating, comment, feedbackType } = req.body;
    const fromUserId = req.user.id; // From JWT token

    // Validate input
    if (!toUserId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if toUser exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-feedback
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'Cannot give feedback to yourself' });
    }

    // Create feedback
    const feedback = await Feedback.create({
      fromUser: fromUserId,
      toUser: toUserId,
      rating,
      comment,
      feedbackType: feedbackType || 'general'
    });

    // Populate user data
    await feedback.populate('fromUser', 'firstName lastName');
    await feedback.populate('toUser', 'firstName lastName');

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        fromUser: {
          id: feedback.fromUser._id,
          name: `${feedback.fromUser.firstName} ${feedback.fromUser.lastName}`
        },
        toUser: {
          id: feedback.toUser._id,
          name: `${feedback.toUser.firstName} ${feedback.toUser.lastName}`
        },
        rating: feedback.rating,
        comment: feedback.comment,
        feedbackType: feedback.feedbackType,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get feedback given by user
const getGivenFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedback = await Feedback.find({ fromUser: userId })
      .populate('toUser', 'firstName lastName')
      .sort({ createdAt: -1 });

    const formattedFeedback = feedback.map(f => ({
      id: f._id,
      toUser: {
        id: f.toUser._id,
        name: `${f.toUser.firstName} ${f.toUser.lastName}`
      },
      rating: f.rating,
      comment: f.comment,
      feedbackType: f.feedbackType,
      createdAt: f.createdAt
    }));

    res.json(formattedFeedback);
  } catch (error) {
    console.error('Get given feedback error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get feedback received by user
const getReceivedFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedback = await Feedback.find({ toUser: userId })
      .populate('fromUser', 'firstName lastName')
      .sort({ createdAt: -1 });

    const formattedFeedback = feedback.map(f => ({
      id: f._id,
      fromUser: {
        id: f.fromUser._id,
        name: `${f.fromUser.firstName} ${f.fromUser.lastName}`
      },
      rating: f.rating,
      comment: f.comment,
      feedbackType: f.feedbackType,
      createdAt: f.createdAt
    }));

    res.json(formattedFeedback);
  } catch (error) {
    console.error('Get received feedback error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get users available for feedback (excluding current user)
const getUsersForFeedback = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.find(
      { _id: { $ne: currentUserId } },
      'firstName lastName name role'
    ).sort({ name: 1 });

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name || `${user.firstName} ${user.lastName}`,
      role: user.role
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Get users for feedback error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { submitFeedback, getGivenFeedback, getReceivedFeedback, getUsersForFeedback };