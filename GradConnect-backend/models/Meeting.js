const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

MeetingSchema.index({ requester: 1 });
MeetingSchema.index({ recipient: 1 });

module.exports = mongoose.model('Meeting', MeetingSchema);
