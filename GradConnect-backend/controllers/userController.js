const User = require('../models/User');
const Feedback = require('../models/Feedback');
const { escapeRegex } = require('../utils/escapeRegex');

const updateProfile = async (req, res) => {
  try {
    const {
      userType, name, enrollmentNo, batch,
      company, role, experience, skills,
      techStack, goals
    } = req.body;

    const update = {
      profile_data: {
        enrollmentNo, batch, company, role,
        experience, skills, techStack, goals
      }
    };

    if (name) update.name = name;
    if (userType === 'student' || userType === 'alumni') update.role = userType;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      update,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.role,
        profile: user.profile_data,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const formatPublicProfile = async (user) => {
  const [ratingAgg] = await Feedback.aggregate([
    { $match: { toUser: user._id } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  return {
    id: user._id,
    name: user.name || `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.role,
    profile: user.profile_data || {},
    rating: ratingAgg ? Math.round(ratingAgg.avgRating * 10) / 10 : null,
    reviewCount: ratingAgg ? ratingAgg.count : 0,
  };
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(await formatPublicProfile(user));
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const listUsers = async (req, res) => {
  try {
    const { search, userType, company, batch } = req.query;
    const currentUserId = req.user.id;

    const query = { _id: { $ne: currentUserId } };

    if (userType === 'alumni' || userType === 'student') {
      query.role = userType;
    }
    if (company) {
      query['profile_data.company'] = { $regex: escapeRegex(company), $options: 'i' };
    }
    if (batch) {
      query['profile_data.batch'] = String(batch);
    }
    if (search) {
      const re = { $regex: escapeRegex(search), $options: 'i' };
      query.$or = [
        { name: re },
        { firstName: re },
        { lastName: re },
        { 'profile_data.company': re },
        { 'profile_data.skills': re },
        { 'profile_data.techStack': re },
      ];
    }

    const users = await User.find(query).select('-password').limit(100).sort({ name: 1 });
    const profiles = await Promise.all(users.map(formatPublicProfile));
    res.json(profiles);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(await formatPublicProfile(user));
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile, getMe, listUsers, getUserById };
