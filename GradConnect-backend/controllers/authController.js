const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    // Validate input
    if (!firstName || !lastName || !email || !password || !userType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with name as "firstName lastName"
    const user = await User.create({ 
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email, 
      password, 
      role: userType 
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.role,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName || user.name.split(' ')[0],
        lastName: user.lastName || user.name.split(' ')[1] || '',
        userType: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { registerUser, loginUser };