const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  target: { type: Number, required: true, min: 1 },
  raised: { type: Number, default: 0 },
  donorCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
