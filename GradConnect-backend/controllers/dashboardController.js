const mongoose = require('mongoose');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const today = new Date().toISOString().slice(0, 10);

    const [messages, meetings, feedbackAgg, unreadCount] = await Promise.all([
      Message.find({ $or: [{ fromUser: userObjectId }, { toUser: userObjectId }] })
        .sort({ createdAt: -1 }).limit(50),
      Meeting.find({ $or: [{ requester: userId }, { recipient: userId }] })
        .populate('requester', 'name firstName lastName')
        .populate('recipient', 'name firstName lastName')
        .sort({ createdAt: -1 }),
      Feedback.find({ toUser: userId }).populate('fromUser', 'name firstName lastName').sort({ createdAt: -1 }).limit(5),
      Message.countDocuments({ toUser: userId, read: false }),
    ]);

    const connectionIds = new Set();
    messages.forEach((m) => {
      const partner = m.fromUser.toString() === userId ? m.toUser.toString() : m.fromUser.toString();
      connectionIds.add(partner);
    });

    const upcomingMeetings = meetings
      .filter((m) => m.date >= today && ['pending', 'accepted'].includes(m.status))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    const ratingCount = await Feedback.countDocuments({ toUser: userId });
    const ratingAvgAgg = await Feedback.aggregate([
      { $match: { toUser: userObjectId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const feedbackScore = ratingAvgAgg.length ? Math.round(ratingAvgAgg[0].avg * 10) / 10 : 0;

    const recentActivity = [];
    messages.slice(0, 3).forEach((m) => {
      if (m.toUser.toString() === userId) {
        recentActivity.push({ type: 'message', time: m.createdAt, refId: m._id, fromUserId: m.fromUser.toString(), preview: m.content });
      }
    });
    meetings.slice(0, 3).forEach((m) => {
      recentActivity.push({ type: 'meeting', time: m.createdAt, status: m.status, topic: m.topic, with: m.requester._id.toString() === userId ? m.recipient : m.requester });
    });
    feedbackAgg.slice(0, 3).forEach((f) => {
      recentActivity.push({ type: 'feedback', time: f.createdAt, rating: f.rating, from: f.fromUser });
    });

    const userIdsToResolve = recentActivity.filter((a) => a.type === 'message').map((a) => a.fromUserId);
    const resolvedUsers = await User.find({ _id: { $in: userIdsToResolve } }).select('name firstName lastName');
    const userMap = new Map(resolvedUsers.map((u) => [u._id.toString(), u.name || `${u.firstName} ${u.lastName}`]));

    const formattedActivity = recentActivity
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5)
      .map((a) => {
        if (a.type === 'message') {
          const name = userMap.get(a.fromUserId) || 'Someone';
          return { type: 'message', title: `New message from ${name}`, description: a.preview, time: a.time };
        }
        if (a.type === 'meeting') {
          const name = a.with?.name || `${a.with?.firstName} ${a.with?.lastName}`;
          return { type: 'meeting', title: `Meeting ${a.status} with ${name}`, description: `${a.topic}`, time: a.time };
        }
        const name = a.from?.name || `${a.from?.firstName} ${a.from?.lastName}`;
        return { type: 'feedback', title: 'New feedback received', description: `${a.rating}-star rating from ${name}`, time: a.time };
      });

    res.json({
      connectionsMade: connectionIds.size,
      unreadMessages: unreadCount,
      meetingsScheduled: upcomingMeetings.length,
      nextMeeting: upcomingMeetings[0] ? { date: upcomingMeetings[0].date, time: upcomingMeetings[0].time, topic: upcomingMeetings[0].topic } : null,
      feedbackScore,
      feedbackCount: ratingCount,
      recentActivity: formattedActivity,
      upcomingMeetings: upcomingMeetings.slice(0, 3).map((m) => ({
        id: m._id,
        topic: m.topic,
        date: m.date,
        time: m.time,
        status: m.status,
        with: m.requester._id.toString() === userId
          ? (m.recipient.name || `${m.recipient.firstName} ${m.recipient.lastName}`)
          : (m.requester.name || `${m.requester.firstName} ${m.requester.lastName}`),
      })),
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };
