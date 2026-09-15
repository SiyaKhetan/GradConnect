const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Meeting = require('../models/Meeting');
const Post = require('../models/Post');
const Donation = require('../models/Donation');

const getLeaderboard = async (req, res) => {
  try {
    const [feedbackAgg, meetingAgg, postAgg, donationAgg] = await Promise.all([
      Feedback.aggregate([
        { $group: { _id: '$toUser', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]),
      Meeting.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$requester', count: { $sum: 1 } } }
      ]),
      Post.aggregate([
        { $group: { _id: '$author', count: { $sum: 1 } } }
      ]),
      Donation.aggregate([
        { $group: { _id: '$donor', total: { $sum: '$amount' } } }
      ]),
    ]);

    const feedbackMap = new Map(feedbackAgg.map((f) => [f._id.toString(), f]));
    const meetingMap = new Map(meetingAgg.map((m) => [m._id.toString(), m.count]));
    const postMap = new Map(postAgg.map((p) => [p._id.toString(), p.count]));
    const donationMap = new Map(donationAgg.map((d) => [d._id.toString(), d.total]));

    const involvedIds = new Set([
      ...feedbackMap.keys(), ...meetingMap.keys(), ...postMap.keys(), ...donationMap.keys(),
    ]);

    const users = await User.find({ _id: { $in: [...involvedIds] } }).select('name firstName lastName profile_data role');

    const rows = users.map((u) => {
      const id = u._id.toString();
      const feedback = feedbackMap.get(id);
      const feedbackReceived = feedback ? feedback.count : 0;
      const avgRating = feedback ? Math.round(feedback.avgRating * 10) / 10 : 0;
      const meetingsCompleted = meetingMap.get(id) || 0;
      const communityPosts = postMap.get(id) || 0;
      const donationsTotal = donationMap.get(id) || 0;

      const points = feedbackReceived * 10 + meetingsCompleted * 15 + communityPosts * 5 + Math.floor(donationsTotal / 1000);

      return {
        userId: id,
        name: u.name || `${u.firstName} ${u.lastName}`,
        batch: u.profile_data?.batch || '',
        company: u.profile_data?.company || '',
        userType: u.role,
        points,
        avgRating,
        feedbackReceived,
        meetingsCompleted,
        communityPosts,
        donationsTotal,
      };
    });

    rows.sort((a, b) => b.points - a.points);
    rows.forEach((r, i) => { r.rank = i + 1; });

    res.json(rows);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLeaderboard };
