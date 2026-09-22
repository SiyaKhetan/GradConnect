const InterviewExperience = require('../models/InterviewExperience');
const { escapeRegex } = require('../utils/escapeRegex');

const formatExperience = (e, userId) => ({
  id: e._id,
  title: e.title,
  author: e.author ? {
    id: e.author._id,
    name: e.author.name || `${e.author.firstName} ${e.author.lastName}`,
    batch: e.author.profile_data?.batch || '',
  } : null,
  company: e.company,
  role: e.role,
  result: e.result,
  difficulty: e.difficulty,
  rounds: e.rounds,
  content: e.content,
  tags: e.tags,
  upvotes: e.upvotes.length,
  upvotedByMe: userId ? e.upvotes.some((id) => id.toString() === userId) : false,
  createdAt: e.createdAt,
});

const listExperiences = async (req, res) => {
  try {
    const { search, company } = req.query;
    const query = {};
    if (company && company !== 'all' && company !== 'All Companies') {
      query.company = company;
    }
    if (search) {
      const re = { $regex: escapeRegex(search), $options: 'i' };
      query.$or = [{ title: re }, { company: re }, { role: re }];
    }

    const experiences = await InterviewExperience.find(query)
      .populate('author', 'name firstName lastName profile_data')
      .sort({ createdAt: -1 });

    res.json(experiences.map((e) => formatExperience(e, req.user.id)));
  } catch (error) {
    console.error('List interview experiences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createExperience = async (req, res) => {
  try {
    const { title, company, role, result, difficulty, rounds, content, tags } = req.body;
    if (!title || !company || !role || !result || !content) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    if (!['Selected', 'Not Selected'].includes(result)) {
      return res.status(400).json({ message: 'Invalid result value' });
    }

    const experience = await InterviewExperience.create({
      author: req.user.id,
      title, company, role, result,
      difficulty: difficulty || 'Medium',
      rounds: Number(rounds) || 1,
      content,
      tags: Array.isArray(tags) ? tags : [],
    });

    const populated = await experience.populate('author', 'name firstName lastName profile_data');
    res.status(201).json(formatExperience(populated, req.user.id));
  } catch (error) {
    console.error('Create interview experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const userId = req.user.id;
    const alreadyUpvoted = experience.upvotes.some((id) => id.toString() === userId);
    if (alreadyUpvoted) {
      experience.upvotes = experience.upvotes.filter((id) => id.toString() !== userId);
    } else {
      experience.upvotes.push(userId);
    }
    await experience.save();

    res.json({ upvotes: experience.upvotes.length, upvotedByMe: !alreadyUpvoted });
  } catch (error) {
    console.error('Toggle upvote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listExperiences, createExperience, toggleUpvote };
