const User = require('../models/User');

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

module.exports = { updateProfile };
