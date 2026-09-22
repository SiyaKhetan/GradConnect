const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

const formatCampaign = (c) => ({
  id: c._id,
  title: c.title,
  description: c.description,
  category: c.category,
  target: c.target,
  raised: c.raised,
  donorCount: c.donorCount,
  createdBy: c.createdBy ? { id: c.createdBy._id, name: c.createdBy.name || `${c.createdBy.firstName} ${c.createdBy.lastName}` } : null,
  createdAt: c.createdAt,
});

const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('createdBy', 'name firstName lastName')
      .sort({ createdAt: -1 });
    res.json(campaigns.map(formatCampaign));
  } catch (error) {
    console.error('List campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCampaign = async (req, res) => {
  try {
    const { title, description, category, target } = req.body;
    if (!title || !target || Number(target) <= 0) {
      return res.status(400).json({ message: 'Please provide a title and a positive target amount' });
    }

    const campaign = await Campaign.create({
      createdBy: req.user.id,
      title,
      description: description || '',
      category: category || 'General',
      target: Number(target),
    });

    const populated = await campaign.populate('createdBy', 'name firstName lastName');
    res.status(201).json(formatCampaign(populated));
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const donate = async (req, res) => {
  try {
    const { amount, message, anonymous } = req.body;
    const donationAmount = Number(amount);
    if (!donationAmount || donationAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a positive donation amount' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const donation = await Donation.create({
      campaign: campaign._id,
      donor: req.user.id,
      amount: donationAmount,
      message: message || '',
      anonymous: !!anonymous,
    });

    campaign.raised += donationAmount;
    campaign.donorCount += 1;
    await campaign.save();
    await campaign.populate('createdBy', 'name firstName lastName');

    const populated = await donation.populate('donor', 'name firstName lastName profile_data');
    res.status(201).json({
      id: populated._id,
      amount: populated.amount,
      message: populated.message,
      anonymous: populated.anonymous,
      donor: populated.anonymous ? null : {
        name: populated.donor.name || `${populated.donor.firstName} ${populated.donor.lastName}`,
        batch: populated.donor.profile_data?.batch || '',
      },
      createdAt: populated.createdAt,
      campaign: formatCampaign(campaign),
    });
  } catch (error) {
    console.error('Donate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const listDonations = async (req, res) => {
  try {
    const { campaignId } = req.query;
    const query = campaignId ? { campaign: campaignId } : {};

    const donations = await Donation.find(query)
      .populate('donor', 'name firstName lastName profile_data')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(donations.map((d) => ({
      id: d._id,
      amount: d.amount,
      message: d.message,
      anonymous: d.anonymous,
      donor: d.anonymous ? null : {
        name: d.donor.name || `${d.donor.firstName} ${d.donor.lastName}`,
        batch: d.donor.profile_data?.batch || '',
      },
      createdAt: d.createdAt,
    })));
  } catch (error) {
    console.error('List donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const topDonors = async (req, res) => {
  try {
    const results = await Donation.aggregate([
      { $group: { _id: '$donor', total: { $sum: '$amount' }, campaigns: { $addToSet: '$campaign' } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    const User = require('../models/User');
    const userIds = results.map((r) => r._id);
    const users = await User.find({ _id: { $in: userIds } }).select('name firstName lastName profile_data');
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    res.json(results.map((r) => {
      const u = userMap.get(r._id.toString());
      return {
        name: u ? (u.name || `${u.firstName} ${u.lastName}`) : 'Unknown',
        batch: u?.profile_data?.batch || '',
        total: r.total,
        campaigns: r.campaigns.length,
      };
    }));
  } catch (error) {
    console.error('Top donors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listCampaigns, createCampaign, donate, listDonations, topDonors };
