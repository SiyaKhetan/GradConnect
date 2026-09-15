const Meeting = require('../models/Meeting');
const User = require('../models/User');

const formatMeeting = (m, userId) => ({
  id: m._id,
  topic: m.topic,
  date: m.date,
  time: m.time,
  status: m.status,
  requester: m.requester ? { id: m.requester._id, name: m.requester.name || `${m.requester.firstName} ${m.requester.lastName}` } : null,
  recipient: m.recipient ? { id: m.recipient._id, name: m.recipient.name || `${m.recipient.firstName} ${m.recipient.lastName}` } : null,
  isMine: m.requester?._id?.toString() === userId,
  createdAt: m.createdAt,
});

const listMyMeetings = async (req, res) => {
  try {
    const userId = req.user.id;
    const meetings = await Meeting.find({ $or: [{ requester: userId }, { recipient: userId }] })
      .populate('requester', 'name firstName lastName')
      .populate('recipient', 'name firstName lastName')
      .sort({ createdAt: -1 });

    res.json(meetings.map((m) => formatMeeting(m, userId)));
  } catch (error) {
    console.error('List meetings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const requestMeeting = async (req, res) => {
  try {
    const { recipientId, topic, date, time } = req.body;
    if (!recipientId || !topic || !date || !time) {
      return res.status(400).json({ message: 'Please provide recipient, topic, date and time' });
    }
    if (recipientId === req.user.id) {
      return res.status(400).json({ message: 'Cannot schedule a meeting with yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const meeting = await Meeting.create({
      requester: req.user.id,
      recipient: recipientId,
      topic,
      date,
      time,
    });

    const populated = await meeting.populate([
      { path: 'requester', select: 'name firstName lastName' },
      { path: 'recipient', select: 'name firstName lastName' },
    ]);

    res.status(201).json(formatMeeting(populated, req.user.id));
  } catch (error) {
    console.error('Request meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const respondToMeeting = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const userId = req.user.id;
    const isParticipant = meeting.requester.toString() === userId || meeting.recipient.toString() === userId;
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    meeting.status = status;
    await meeting.save();

    const populated = await meeting.populate([
      { path: 'requester', select: 'name firstName lastName' },
      { path: 'recipient', select: 'name firstName lastName' },
    ]);

    res.json(formatMeeting(populated, userId));
  } catch (error) {
    console.error('Respond to meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listMyMeetings, requestMeeting, respondToMeeting };
