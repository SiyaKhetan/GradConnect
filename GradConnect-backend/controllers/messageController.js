const Message = require('../models/Message');
const User = require('../models/User');

const listConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const messages = await Message.find({
      $or: [{ fromUser: userObjectId }, { toUser: userObjectId }]
    }).sort({ createdAt: -1 });

    const byPartner = new Map();
    for (const m of messages) {
      const partnerId = m.fromUser.toString() === userId ? m.toUser.toString() : m.fromUser.toString();
      if (!byPartner.has(partnerId)) {
        byPartner.set(partnerId, { lastMessage: m, unread: 0 });
      }
      if (m.toUser.toString() === userId && !m.read) {
        byPartner.get(partnerId).unread += 1;
      }
    }

    const partnerIds = [...byPartner.keys()];
    const partners = await User.find({ _id: { $in: partnerIds } }).select('name firstName lastName');
    const partnerMap = new Map(partners.map((p) => [p._id.toString(), p]));

    const conversations = partnerIds
      .map((id) => {
        const partner = partnerMap.get(id);
        if (!partner) return null;
        const { lastMessage, unread } = byPartner.get(id);
        return {
          userId: id,
          name: partner.name || `${partner.firstName} ${partner.lastName}`,
          lastMessage: lastMessage.content,
          timestamp: lastMessage.createdAt,
          unread,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(conversations);
  } catch (error) {
    console.error('List conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getThread = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { fromUser: userId, toUser: otherId },
        { fromUser: otherId, toUser: userId },
      ]
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { fromUser: otherId, toUser: userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages.map((m) => ({
      id: m._id,
      fromUser: m.fromUser.toString(),
      toUser: m.toUser.toString(),
      content: m.content,
      isMe: m.fromUser.toString() === userId,
      createdAt: m.createdAt,
    })));
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { toUserId, content } = req.body;
    if (!toUserId || typeof toUserId !== 'string' || !content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Please provide a recipient and message content' });
    }
    if (toUserId === req.user.id) {
      return res.status(400).json({ message: 'Cannot message yourself' });
    }

    const recipient = await User.findById(toUserId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await Message.create({
      fromUser: req.user.id,
      toUser: toUserId,
      content: content.trim(),
    });

    res.status(201).json({
      id: message._id,
      fromUser: message.fromUser.toString(),
      toUser: message.toUser.toString(),
      content: message.content,
      isMe: true,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listConversations, getThread, sendMessage };
