const mongoose = require('mongoose');

const InterviewExperienceSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  result: { type: String, enum: ['Selected', 'Not Selected'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  rounds: { type: Number, default: 1 },
  content: { type: String, required: true, trim: true },
  tags: [{ type: String }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('InterviewExperience', InterviewExperienceSchema);
