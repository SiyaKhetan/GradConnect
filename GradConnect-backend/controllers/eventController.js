const Event = require('../models/Event');

const formatEvent = (e, userId) => ({
  id: e._id,
  title: e.title,
  type: e.type,
  description: e.description,
  date: e.date,
  time: e.time,
  mode: e.mode,
  location: e.location,
  speaker: e.speaker,
  speakerRole: e.speakerRole,
  capacity: e.capacity,
  registered: e.attendees.length,
  tags: e.tags,
  isRegistered: userId ? e.attendees.some((id) => id.toString() === userId) : false,
  host: e.host ? { id: e.host._id, name: e.host.name || `${e.host.firstName} ${e.host.lastName}` } : null,
  createdAt: e.createdAt,
});

const listEvents = async (req, res) => {
  try {
    const { scope } = req.query;
    const today = new Date().toISOString().slice(0, 10);
    const query = {};

    if (scope === 'past') {
      query.date = { $lt: today };
    } else if (scope === 'mine') {
      query.attendees = req.user.id;
    } else {
      query.date = { $gte: today };
    }

    const events = await Event.find(query)
      .populate('host', 'name firstName lastName')
      .sort({ date: scope === 'past' ? -1 : 1 });

    res.json(events.map((e) => formatEvent(e, req.user.id)));
  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, type, description, date, time, mode, location, speaker, speakerRole, capacity, tags } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: 'Please provide at least a title and date' });
    }

    const event = await Event.create({
      host: req.user.id,
      title, type, description, date, time,
      mode: mode === 'In-Person' ? 'In-Person' : 'Virtual',
      location, speaker, speakerRole,
      capacity: Number(capacity) || 100,
      tags: Array.isArray(tags) ? tags : [],
    });

    const populated = await event.populate('host', 'name firstName lastName');
    res.status(201).json(formatEvent(populated, req.user.id));
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.user.id;
    const alreadyRegistered = event.attendees.some((id) => id.toString() === userId);
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered' });
    }
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    event.attendees.push(userId);
    await event.save();

    const populated = await event.populate('host', 'name firstName lastName');
    res.json(formatEvent(populated, userId));
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listEvents, createEvent, registerForEvent };
