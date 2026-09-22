const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

MessageSchema.index({ fromUser: 1, toUser: 1 });
MessageSchema.index({ toUser: 1, read: 1 });

module.exports = mongoose.model('Message', MessageSchema);
