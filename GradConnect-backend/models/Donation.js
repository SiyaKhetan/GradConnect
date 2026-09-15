const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1 },
  message: { type: String, default: '' },
  anonymous: { type: Boolean, default: false },
}, { timestamps: true });

DonationSchema.index({ campaign: 1 });
DonationSchema.index({ donor: 1 });

module.exports = mongoose.model('Donation', DonationSchema);
