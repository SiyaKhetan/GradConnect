const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, default: 'Workshop' },
  description: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  mode: { type: String, enum: ['Virtual', 'In-Person'], default: 'Virtual' },
  location: { type: String, default: '' },
  speaker: { type: String, default: '' },
  speakerRole: { type: String, default: '' },
  capacity: { type: Number, default: 100 },
  tags: [{ type: String }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
