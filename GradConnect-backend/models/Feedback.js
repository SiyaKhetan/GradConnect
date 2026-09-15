const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  feedbackType: {
    type: String,
    enum: ['meeting', 'chat', 'general'],
    default: 'general'
  }
}, { timestamps: true });

// Index for efficient queries
FeedbackSchema.index({ fromUser: 1, toUser: 1 });
FeedbackSchema.index({ toUser: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);